using BookApplication_React_TS.Server.Data;
using BookApplication_React_TS.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookApplication_React_TS.Server.Controllers.Books
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BooksController(BookApplication_React_TSServerContext context) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _context = context;

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBook()
        {
            return await _context.Book.Where(b => b.UserId == GetUserId()).ToListAsync();
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Book.FirstOrDefaultAsync(b => b.Id == id && b.UserId == GetUserId());
            if (book == null) return NotFound();
            return book;
        }

        // GET: api/Books/shelf/read
        [HttpGet("shelf/{shelf}")]
        public IActionResult GetBookByShelfName(string shelf)
        {
            var books = _context.Book
                .Where(b => b.Shelf != null && b.Shelf.ToLower() == shelf.ToLower() && b.UserId == GetUserId())
                .ToList();

            if (books == null || books.Count == 0)
                return Ok(new List<Book>());

            return Ok(books);
        }

        // PUT: api/Books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.Id) return BadRequest();

            book.UserId = GetUserId(); // ensure ownership
            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        // POST: api/Books
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            book.UserId = GetUserId(); // link to logged-in user
            _context.Book.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetBook", new { id = book.Id }, book);
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Book.FirstOrDefaultAsync(b => b.Id == id && b.UserId == GetUserId());
            if (book == null) return NotFound();
            _context.Book.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetPublicBooks(int userId)
        {
            var books = await _context.Book
                .Where(b => b.UserId == userId)
                .GroupBy(b => b.Shelf)
                .Select(g => new {
                    Shelf = g.Key,
                    Books = g.Select(b => new {
                        b.Id,
                        b.Title,
                        b.Author,
                        b.Genre,
                        b.Rating,
                        b.Description
                    }).ToList()
                })
                .ToListAsync();

            return Ok(books);
        }

        // GET: api/books/shelves
        [HttpGet("shelves")]
        public async Task<IActionResult> GetShelves()
        {
            var shelves = await _context.Book
                .Where(b => b.UserId == GetUserId() && b.Shelf != null)
                .Select(b => b.Shelf)
                .Distinct()
                .ToListAsync();

            return Ok(shelves);
        }

        private bool BookExists(int id)
        {
            return _context.Book.Any(e => e.Id == id && e.UserId == GetUserId());
        }
    }
}
