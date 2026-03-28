using System.ComponentModel.DataAnnotations;

namespace BookApplication_React_TS.Server.DTO
{
    public record UserProfileDto(int Id, string Username, string Email, string? Bio, int? ReadingGoal);
    public record UpdateProfileDto(string Username, string Email, string? Bio, int? ReadingGoal);
    public class ChangePasswordDto
    {
        public required string CurrentPassword { get; set; }

        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public required string NewPassword { get; set; }
    }

    public record YearlyReadingDto(int Year, int? Goal, int BooksRead);
}