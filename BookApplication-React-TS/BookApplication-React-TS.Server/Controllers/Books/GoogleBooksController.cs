using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookApplication_React_TS.Server.Controllers.Books
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GoogleBooksController(IConfiguration config, HttpClient httpClient) : ControllerBase
    {
        private readonly string _apiKey = config["GoogleBooks:ApiKey"]!;

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest(new { message = "Query is required." });

            var url = $"https://www.googleapis.com/books/v1/volumes?q={Uri.EscapeDataString(q)}&maxResults=10&key={_apiKey}";
            var res = await httpClient.GetAsync(url);
            if (!res.IsSuccessStatusCode)
                return StatusCode((int)res.StatusCode, new { message = "Google Books API error." });

            var json = await res.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }
    }
}