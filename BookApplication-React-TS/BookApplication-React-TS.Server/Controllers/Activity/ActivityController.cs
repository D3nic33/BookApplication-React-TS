using BookApplication_React_TS.Server.Data;
using BookApplication_React_TS.Server.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookApplication_React_TS.Server.Controllers.Activity
{
    [ApiController]
    [Route("api/activity")]
    [Authorize]
    public class ActivityController(BookApplication_React_TSServerContext context) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _context = context;

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("feed")]
        public async Task<IActionResult> GetFeed()
        {
            var currentUserId = GetUserId();

            var followedIds = await _context.Follows
                .Where(f => f.FollowerId == currentUserId)
                .Select(f => f.FollowingId)
                .ToListAsync();

            if (!followedIds.Any())
                return Ok(new List<ActivityFeedItemDto>());

            var bookActivities = await _context.Book
                .Where(b => followedIds.Contains(b.UserId))
                .Include(b => b.User)
                .Select(b => new ActivityFeedItemDto(
                    "book_added",
                    b.User!.Id,
                    b.User.Username,
                    b.CreatedAt,
                    new ActivityBookDto(b.Id, b.Title, b.Author, b.CoverUrl, b.Shelf),
                    null))
                .ToListAsync();

            var noteActivities = await _context.Notes
                .Where(n => followedIds.Contains(n.UserId))
                .Include(n => n.Book)
                .Include(n => n.User)
                .Select(n => new ActivityFeedItemDto(
                    "note_created",
                    n.User!.Id,
                    n.User.Username,
                    n.CreatedAt,
                    new ActivityBookDto(n.Book!.Id, n.Book.Title, n.Book.Author, n.Book.CoverUrl, n.Book.Shelf),
                    n.Title))
                .ToListAsync();

            var highlightActivities = await _context.Highlights
                .Where(h => followedIds.Contains(h.UserId))
                .Include(h => h.Book)
                .Include(h => h.User)
                .Select(h => new ActivityFeedItemDto(
                    "highlight_created",
                    h.User!.Id,
                    h.User.Username,
                    h.CreatedAt,
                    new ActivityBookDto(h.Book!.Id, h.Book.Title, h.Book.Author, h.Book.CoverUrl, h.Book.Shelf),
                    h.Content.Length > 120 ? h.Content.Substring(0, 120) + "…" : h.Content))
                .ToListAsync();

            var feed = bookActivities
                .Concat(noteActivities)
                .Concat(highlightActivities)
                .OrderByDescending(x => x.Timestamp)
                .Take(50)
                .ToList();

            return Ok(feed);
        }
    }
}
