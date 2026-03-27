using System.ComponentModel.DataAnnotations;

namespace BookApplication_React_TS.Server.Models
{
    public class Book
    {
        public int Id { get; set; }

        public string? CoverUrl { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        [Display(Name = "Release Date")]
        [DataType(DataType.Date)]

        public DateTime ReleaseDate { get; set; }

        public string Genre { get; set; } = string.Empty;

        public double Rating { get; set; } = 0.0;

        public string Shelf { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        public int? CurrentPage { get; set; }

        public int? TotalPages { get; set; }

        public DateTime? DateCompleted { get; set; }

        public int UserId { get; set; }

        public User? User { get; set; }
    }
}
