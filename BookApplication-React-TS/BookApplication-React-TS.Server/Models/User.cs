using System.ComponentModel.DataAnnotations;

namespace BookApplication_React_TS.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;   // NVARCHAR(50)

        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;      // NVARCHAR(256)

        [MaxLength(512)]
        public string PasswordHash { get; set; } = string.Empty; // NVARCHAR(512)

        [MaxLength(500)]
        public string? Bio { get; set; }                       // NVARCHAR(500), nullable

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // DATETIME2

        public int? ReadingGoal { get; set; }
    }
}
