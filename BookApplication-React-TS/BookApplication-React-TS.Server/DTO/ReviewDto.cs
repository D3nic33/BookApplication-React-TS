namespace BookApplication_React_TS.Server.DTO
{
    public record CreateReviewDto(int Stars, string ReviewText);
    public record UpdateReviewDto(int Stars, string ReviewText);

    public record ReviewResponseDto(
        int Id,
        int BookId,
        int UserId,
        string Username,
        int Stars,
        string ReviewText,
        DateTime CreatedAt,
        DateTime? UpdatedAt
    );
}