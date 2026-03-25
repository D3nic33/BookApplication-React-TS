using BookApplication_React_TS.Server.Data;
using BookApplication_React_TS.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookApplication_React_TS.Server.Controllers.Follow
{
    [ApiController]
    [Route("api/follow")]
    [Authorize]
    public class UserFollowController(BookApplication_React_TSServerContext context) : ControllerBase
    {
        private readonly BookApplication_React_TSServerContext _context = context;

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("{targetUserId}")]
        public async Task<IActionResult> Follow(int targetUserId)
        {
            var currentUserId = GetUserId();
            if (currentUserId == targetUserId) return BadRequest("You cannot follow yourself.");

            var already = await _context.Follows
                .AnyAsync(f => f.FollowerId == currentUserId && f.FollowingId == targetUserId);
            if (already) return BadRequest("Already following.");

            _context.Follows.Add(new UserFollow { FollowerId = currentUserId, FollowingId = targetUserId });
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{targetUserId}")]
        public async Task<IActionResult> Unfollow(int targetUserId)
        {
            var currentUserId = GetUserId();
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowingId == targetUserId);
            if (follow == null) return NotFound();

            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("users/{userId}/followers")]
        public async Task<IActionResult> GetFollowers(int userId)
        {
            var followers = await _context.Follows
                .Where(f => f.FollowingId == userId)
                .Select(f => new { f.Follower.Id, f.Follower.Username })
                .ToListAsync();
            return Ok(followers);
        }

        [HttpGet("users/{userId}/following")]
        public async Task<IActionResult> GetFollowing(int userId)
        {
            var following = await _context.Follows
                .Where(f => f.FollowerId == userId)
                .Select(f => new { f.Following.Id, f.Following.Username })
                .ToListAsync();
            return Ok(following);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return Ok(new List<object>());
            var currentUserId = GetUserId();

            var users = await _context.User
                .Where(u => u.Username.Contains(query) && u.Id != currentUserId)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    IsFollowing = _context.Follows
                        .Any(f => f.FollowerId == currentUserId && f.FollowingId == u.Id)
                })
                .Take(10)
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("isfollowing/{targetUserId}")]
        public async Task<IActionResult> IsFollowing(int targetUserId)
        {
            var currentUserId = GetUserId();
            var following = await _context.Follows
                .AnyAsync(f => f.FollowerId == currentUserId && f.FollowingId == targetUserId);
            return Ok(new { isFollowing = following });
        }

        [HttpGet("{userId}/counts")]
        public async Task<IActionResult> GetFollowCounts(int userId)
        {
            var followers = await _context.Follows.CountAsync(f => f.FollowingId == userId);
            var following = await _context.Follows.CountAsync(f => f.FollowerId == userId);
            return Ok(new { followers, following });
        }
    }
}
