using System.ComponentModel.DataAnnotations;

namespace BookApplication_React_TS.Server.DTO
{
    public class RegisterDto
    {
        public required string Username { get; set; }

        public required string Email { get; set; }

        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public required string Password { get; set; }
    }

    public record LoginDto(string Email, string Password);
    public record AuthResponseDto(string Token);
}