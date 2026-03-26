using BookApplication_React_TS.Server.Data;
using BookApplication_React_TS.Server.DTO;
using BookApplication_React_TS.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookApplication_React_TS.Server.Controllers.Books
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotesController(BookApplication_React_TSServerContext db) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _db = db;
        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET: api/notes/book/5
        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetNotesForBook(int bookId)
        {
            var userId = GetUserId();

            var book = await _db.Book.FirstOrDefaultAsync(b => b.Id == bookId && b.UserId == userId);
            if (book is null) return NotFound(new { message = "Book not found." });

            var notes = await _db.Notes
                .Where(n => n.BookId == bookId && n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NoteResponseDto(n.Id, n.BookId, n.UserId, n.Title, n.Content, n.PageNumber, n.CreatedAt, n.UpdatedAt))
                .ToListAsync();

            return Ok(notes);
        }

        // POST: api/notes/book/5
        [HttpPost("book/{bookId}")]
        public async Task<IActionResult> CreateNote(int bookId, [FromBody] CreateNoteDto dto)
        {
            var userId = GetUserId();

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { message = "Note content cannot be empty." });

            var book = await _db.Book.FirstOrDefaultAsync(b => b.Id == bookId && b.UserId == userId);
            if (book is null) return NotFound(new { message = "Book not found." });

            if (book.Shelf.ToLower() != "reading")
                return BadRequest(new { message = "You can only add notes to books on your Reading shelf." });

            var note = new Note
            {
                BookId = bookId,
                UserId = userId,
                Title = dto.Title,
                Content = dto.Content,
                PageNumber = dto.PageNumber
            };

            _db.Notes.Add(note);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotesForBook), new { bookId },
                new NoteResponseDto(note.Id, note.BookId, note.UserId, note.Title, note.Content, note.PageNumber, note.CreatedAt, note.UpdatedAt));
        }

        // PUT: api/notes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] UpdateNoteDto dto)
        {
            var userId = GetUserId();

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { message = "Note content cannot be empty." });

            var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note is null) return NotFound();

            note.Title = dto.Title;
            note.Content = dto.Content;
            note.PageNumber = dto.PageNumber;
            note.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Note updated." });
        }

        // DELETE: api/notes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var userId = GetUserId();

            var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note is null) return NotFound();

            _db.Notes.Remove(note);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Note deleted." });
        }
    }
}
