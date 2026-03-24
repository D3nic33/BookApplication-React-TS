using BookApplication_React_TS.Server.Data;
using BookApplication_React_TS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BookApplication_React_TS.Server.DTO;


namespace BookApplication_React_TS.Server.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(BookApplication_React_TSServerContext db, IConfiguration config) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _db = db;
        private readonly IConfiguration _config = config;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Check if email is already taken
            if (await _db.User.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "An account with this email already exists." });
            }

            // Check if username is already taken
            if (await _db.User.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest(new { message = "This username is already taken." });
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
            };

            _db.User.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new AuthResponseDto(GenerateJwt(user)));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.User.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user is null || !VerifyPassword(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            return Ok(new AuthResponseDto(GenerateJwt(user)));
        }

        // --- Helpers ---

        private static string HashPassword(string password)
        {
            // Uses PBKDF2 with a random salt
            byte[] salt = RandomNumberGenerator.GetBytes(16);
            byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations: 600_000,
                HashAlgorithmName.SHA256,
                outputLength: 32
            );
            // Store as "salt:hash" (both base64)
            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2) return false;

            byte[] salt = Convert.FromBase64String(parts[0]);
            byte[] expectedHash = Convert.FromBase64String(parts[1]);

            byte[] actualHash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations: 600_000,
                HashAlgorithmName.SHA256,
                outputLength: 32
            );
            return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
        }

        private string GenerateJwt(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
