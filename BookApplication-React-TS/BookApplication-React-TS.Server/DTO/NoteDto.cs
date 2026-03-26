namespace BookApplication_React_TS.Server.DTO
{
    public record CreateNoteDto(string Title, string Content);
    public record UpdateNoteDto(string Title, string Content);
    public record NoteResponseDto(int Id, int BookId, int UserId, string Title, string Content, DateTime CreatedAt, DateTime? UpdatedAt);
}
