namespace BookApplication_React_TS.Server.DTO
{
    public record CreateReviewDto(double Rating, string ReviewText);
    public record UpdateReviewDto(double Rating, string ReviewText);

    public record ReviewResponseDto(
        int Id,
        int BookId,
        int UserId,
        string Username,
        double Stars,
        string ReviewText,
        DateTime CreatedAt,
        DateTime? UpdatedAt
    );
}