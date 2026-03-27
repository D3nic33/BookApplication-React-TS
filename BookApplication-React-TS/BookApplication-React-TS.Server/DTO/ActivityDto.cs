namespace BookApplication_React_TS.Server.DTO
{
    public record ActivityBookDto(
        int Id,
        string Title,
        string Author,
        string? CoverUrl,
        string Shelf);

    public record ActivityFeedItemDto(
        string Type,
        int UserId,
        string Username,
        DateTime Timestamp,
        ActivityBookDto Book,
        string? Detail);
}
