namespace BookApplication_React_TS.Server.DTO
{
    public record UserProfileDto(int Id, string Username, string Email, string? Bio, int? ReadingGoal);
    public record UpdateProfileDto(string Username, string Email, string? Bio, int? ReadingGoal);
    public record ChangePasswordDto(string CurrentPassword, string NewPassword);
}