namespace BookApplication_React_TS.Server.DTO
{
    public record CreateHighlightDto(string Content, int PageNumber);
    public record UpdateHighlightDto(string Content, int PageNumber);
    public record HighlightResponseDto(int Id, int BookId, int UserId, string Content, int PageNumber, DateTime CreatedAt, DateTime? UpdatedAt);
}
