using BookApplication_React_TS.Server.Data;
using BookApplication_React_TS.Server.DTO;
using BookApplication_React_TS.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BookApplication_React_TS.Server.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController(BookApplication_React_TSServerContext db) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _db = db;

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _db.User.FindAsync(userId);
            if (user is null) return NotFound();

            return Ok(new UserProfileDto(user.Id, user.Username, user.Email, user.Bio, user.ReadingGoal));
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _db.User.FindAsync(userId);
            if (user is null) return NotFound();

            if (await _db.User.AnyAsync(u => u.Username == dto.Username && u.Id != userId))
                return BadRequest(new { message = "Username is already taken." });

            if (await _db.User.AnyAsync(u => u.Email == dto.Email && u.Id != userId))
                return BadRequest(new { message = "Email is already in use." });

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.Bio = dto.Bio;
            user.ReadingGoal = dto.ReadingGoal;

            _db.Entry(user).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            if (dto.ReadingGoal.HasValue)
            {
                var currentYear = DateTime.UtcNow.Year;
                var existingGoal = await _db.ReadingGoalHistory
                    .FirstOrDefaultAsync(r => r.UserId == userId && r.Year == currentYear);

                if (existingGoal is null)
                    _db.ReadingGoalHistory.Add(new ReadingGoalHistory { UserId = userId, Year = currentYear, Goal = dto.ReadingGoal.Value });
                else
                {
                    existingGoal.Goal = dto.ReadingGoal.Value;
                    _db.Entry(existingGoal).State = EntityState.Modified;
                }
                await _db.SaveChangesAsync();
            }

            return Ok(new UserProfileDto(user.Id, user.Username, user.Email, user.Bio, user.ReadingGoal));
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _db.User.FindAsync(userId);
            if (user is null) return NotFound();

            if (!VerifyPassword(dto.CurrentPassword, user.PasswordHash))
                return BadRequest(new { message = "Current password is incorrect." });

            user.PasswordHash = HashPassword(dto.NewPassword);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully." });
        }

        [HttpGet("me/books/read/count")]
        public async Task<IActionResult> GetReadBookCount()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var count = await _db.Book.CountAsync(b => b.UserId == userId && b.Shelf == "Read");
            return Ok(new { count });
        }

        [HttpGet("me/stats")]
        public async Task<IActionResult> GetReadingStats()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var yearStart = new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            var books = await _db.Book.Where(b => b.UserId == userId).ToListAsync();

            var completedThisMonth = books
                .Where(b => b.Shelf.Equals("Read", StringComparison.OrdinalIgnoreCase)
                         && b.DateCompleted.HasValue
                         && b.DateCompleted.Value >= monthStart)
                .ToList();

            var booksReadThisMonth = completedThisMonth.Count;

            var booksReadThisYear = books.Count(b =>
                b.Shelf.Equals("Read", StringComparison.OrdinalIgnoreCase)
                && b.DateCompleted.HasValue
                && b.DateCompleted.Value >= yearStart);

            var pagesFromCompleted = completedThisMonth.Sum(b => b.TotalPages ?? 0);
            var pagesFromReading = books
                .Where(b => b.Shelf.Equals("Reading", StringComparison.OrdinalIgnoreCase))
                .Sum(b => b.CurrentPage ?? 0);
            var pagesReadThisMonth = pagesFromCompleted + pagesFromReading;

            var genreBreakdown = completedThisMonth
                .Where(b => !string.IsNullOrWhiteSpace(b.Genre))
                .GroupBy(b => b.Genre)
                .Select(g => new GenreStatDto(g.Key, g.Count()))
                .OrderByDescending(g => g.Count)
                .ToList();

            return Ok(new ReadingStatsDto(booksReadThisMonth, booksReadThisYear, pagesReadThisMonth, genreBreakdown));
        }

        [HttpGet("me/reading-history")]
        public async Task<IActionResult> GetReadingHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _db.User.FindAsync(userId);
            if (user is null) return NotFound();

            var startYear = user.CreatedAt.Year;
            var currentYear = DateTime.UtcNow.Year;

            var readBooks = await _db.Book
                .Where(b => b.UserId == userId && b.Shelf == "Read" && b.DateCompleted.HasValue)
                .Select(b => b.DateCompleted!.Value.Year)
                .ToListAsync();

            var goalsByYear = await _db.ReadingGoalHistory
                .Where(r => r.UserId == userId)
                .ToDictionaryAsync(r => r.Year, r => r.Goal);

            var result = new List<YearlyReadingDto>();
            for (int year = startYear; year <= currentYear; year++)
            {
                int booksRead = readBooks.Count(y => y == year);
                int? goal = goalsByYear.TryGetValue(year, out var g) ? g : null;
                result.Add(new YearlyReadingDto(year, goal, booksRead));
            }

            return Ok(result);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetPublicProfile(int userId)
        {
            var user = await _db.User
                .Where(u => u.Id == userId)
                .Select(u => new { u.Id, u.Username, u.Bio, u.ReadingGoal })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("me/counts")]
        public async Task<IActionResult> GetMyFollowCounts()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var currentUserId = await _db.User.FindAsync(userId);
            var followers = await _db.Follows.CountAsync(f => f.FollowingId == currentUserId.Id);
            var following = await _db.Follows.CountAsync(f => f.FollowerId == currentUserId.Id);
            return Ok(new { followers, following });
        }

        private static string HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(16);
            byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations: 600_000,
                HashAlgorithmName.SHA256,
                outputLength: 32
            );
            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2) return false;
            byte[] salt = Convert.FromBase64String(parts[0]);
            byte[] expected = Convert.FromBase64String(parts[1]);
            byte[] actual = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations: 600_000,
                HashAlgorithmName.SHA256,
                outputLength: 32
            );
            return CryptographicOperations.FixedTimeEquals(actual, expected);
        }
    }
}