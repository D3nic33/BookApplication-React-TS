using BookApplication_React_TS.Server.Data;
using BookApplication_React_TS.Server.DTO;
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