namespace BookApplication_React_TS.Server.DTO
{
    public record CreateNoteDto(string Title, string Content, int? PageNumber);
    public record UpdateNoteDto(string Title, string Content, int? PageNumber);
    public record NoteResponseDto(int Id, int BookId, int UserId, string Title, string Content, int? PageNumber, DateTime CreatedAt, DateTime? UpdatedAt);
}
