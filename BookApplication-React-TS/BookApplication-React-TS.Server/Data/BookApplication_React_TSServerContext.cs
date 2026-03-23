using Microsoft.EntityFrameworkCore;
using BookApplication_React_TS.Server.Models;

namespace BookApplication_React_TS.Server.Data
{
    public class BookApplication_React_TSServerContext(DbContextOptions<BookApplication_React_TSServerContext> options) : DbContext(options)
    {
        public DbSet<Book> Book { get; set; } = default!;

        public DbSet<User> User { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Username).HasMaxLength(50);
                entity.Property(u => u.Email).HasMaxLength(256);
                entity.Property(u => u.PasswordHash).HasMaxLength(512);
                entity.Property(u => u.Bio).HasMaxLength(500);
                entity.Property(u => u.ReadingGoal).IsRequired(false);
            });
        }
    }
}
