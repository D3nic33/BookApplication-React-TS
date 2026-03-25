using System.ComponentModel.DataAnnotations.Schema;

namespace BookApplication_React_TS.Server.Models
{
    public class UserFollow
    {
        public int Id { get; set; }
        public int FollowerId { get; set; } // the user who follows
        public int FollowingId { get; set; } // the user being followed

        [ForeignKey("FollowerId")]
        public User Follower { get; set; }

        [ForeignKey("FollowingId")]
        public User Following { get; set; }
    }
}
