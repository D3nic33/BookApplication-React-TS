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
    public class HighlightsController(BookApplication_React_TSServerContext db) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _db = db;
        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET: api/highlights/book/5
        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetHighlightsForBook(int bookId)
        {
            var userId = GetUserId();

            var book = await _db.Book.FirstOrDefaultAsync(b => b.Id == bookId && b.UserId == userId);
            if (book is null) return NotFound(new { message = "Book not found." });

            var highlights = await _db.Highlights
                .Where(h => h.BookId == bookId && h.UserId == userId)
                .OrderBy(h => h.PageNumber)
                .Select(h => new HighlightResponseDto(h.Id, h.BookId, h.UserId, h.Content, h.PageNumber, h.CreatedAt, h.UpdatedAt))
                .ToListAsync();

            return Ok(highlights);
        }

        // POST: api/highlights/book/5
        [HttpPost("book/{bookId}")]
        public async Task<IActionResult> CreateHighlight(int bookId, [FromBody] CreateHighlightDto dto)
        {
            var userId = GetUserId();

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { message = "Highlight content cannot be empty." });

            if (dto.PageNumber < 1)
                return BadRequest(new { message = "Page number must be at least 1." });

            var book = await _db.Book.FirstOrDefaultAsync(b => b.Id == bookId && b.UserId == userId);
            if (book is null) return NotFound(new { message = "Book not found." });

            if (book.Shelf.ToLower() != "reading")
                return BadRequest(new { message = "You can only add highlights to books on your Reading shelf." });

            var highlight = new Highlight
            {
                BookId = bookId,
                UserId = userId,
                Content = dto.Content,
                PageNumber = dto.PageNumber
            };

            _db.Highlights.Add(highlight);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHighlightsForBook), new { bookId },
                new HighlightResponseDto(highlight.Id, highlight.BookId, highlight.UserId, highlight.Content, highlight.PageNumber, highlight.CreatedAt, highlight.UpdatedAt));
        }

        // PUT: api/highlights/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHighlight(int id, [FromBody] UpdateHighlightDto dto)
        {
            var userId = GetUserId();

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { message = "Highlight content cannot be empty." });

            if (dto.PageNumber < 1)
                return BadRequest(new { message = "Page number must be at least 1." });

            var highlight = await _db.Highlights.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
            if (highlight is null) return NotFound();

            highlight.Content = dto.Content;
            highlight.PageNumber = dto.PageNumber;
            highlight.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Highlight updated." });
        }

        // DELETE: api/highlights/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHighlight(int id)
        {
            var userId = GetUserId();

            var highlight = await _db.Highlights.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
            if (highlight is null) return NotFound();

            _db.Highlights.Remove(highlight);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Highlight deleted." });
        }
    }
}
