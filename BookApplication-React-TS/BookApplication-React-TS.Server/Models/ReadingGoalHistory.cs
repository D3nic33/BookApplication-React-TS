using System.ComponentModel.DataAnnotations.Schema;

namespace BookApplication_React_TS.Server.Models
{
    public class ReadingGoalHistory
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int Year { get; set; }

        public int Goal { get; set; }
    }
}
