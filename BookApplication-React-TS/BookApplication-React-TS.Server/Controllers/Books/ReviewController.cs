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
    public class ReviewsController(BookApplication_React_TSServerContext db) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _db = db;
        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET: api/reviews/book/5 — all reviews for a book (public)
        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetReviewsForBook(int bookId)
        {
            var reviews = await _db.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponseDto(
                    r.Id,
                    r.BookId,
                    r.UserId,
                    r.User!.Username,
                    r.Stars,
                    r.ReviewText,
                    r.CreatedAt,
                    r.UpdatedAt
                ))
                .ToListAsync();

            return Ok(reviews);
        }

        // GET: api/reviews/book/5/mine — current user's review for a book
        [HttpGet("book/{bookId}/mine")]
        public async Task<IActionResult> GetMyReview(int bookId)
        {
            var userId = GetUserId();
            var review = await _db.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.BookId == bookId && r.UserId == userId);

            if (review is null) return NotFound();

            return Ok(new ReviewResponseDto(
                review.Id, review.BookId, review.UserId,
                review.User!.Username, review.Stars,
                review.ReviewText, review.CreatedAt, review.UpdatedAt
            ));
        }

        // POST: api/reviews/book/5
        [HttpPost("book/{bookId}")]
        public async Task<IActionResult> CreateReview(int bookId, [FromBody] CreateReviewDto dto)
        {
            var userId = GetUserId();

            if (dto.Stars < 1 || dto.Stars > 5)
                return BadRequest(new { message = "Stars must be between 1 and 5." });

            // Ensure the book belongs to this user
            var book = await _db.Book.FirstOrDefaultAsync(b => b.Id == bookId && b.UserId == userId);
            if (book is null) return NotFound(new { message = "Book not found." });

            if (book.Shelf.ToLower() != "read")
                return BadRequest(new { message = "You can only review books on your Read shelf." });

            var existing = await _db.Reviews.AnyAsync(r => r.BookId == bookId && r.UserId == userId);
            if (existing)
                return Conflict(new { message = "You have already reviewed this book." });

            var review = new Review
            {
                BookId = bookId,
                UserId = userId,
                Stars = dto.Stars,
                ReviewText = dto.ReviewText
            };

            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            await _db.Entry(review).Reference(r => r.User).LoadAsync();

            return CreatedAtAction(nameof(GetMyReview), new { bookId }, new ReviewResponseDto(
                review.Id, review.BookId, review.UserId,
                review.User!.Username, review.Stars,
                review.ReviewText, review.CreatedAt, review.UpdatedAt
            ));
        }

        // PUT: api/reviews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewDto dto)
        {
            var userId = GetUserId();

            if (dto.Stars < 1 || dto.Stars > 5)
                return BadRequest(new { message = "Stars must be between 1 and 5." });

            var review = await _db.Reviews.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            if (review is null) return NotFound();

            review.Stars = dto.Stars;
            review.ReviewText = dto.ReviewText;
            review.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Review updated." });
        }

        // DELETE: api/reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userId = GetUserId();
            var review = await _db.Reviews.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            if (review is null) return NotFound();

            _db.Reviews.Remove(review);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Review deleted." });
        }
    }
}