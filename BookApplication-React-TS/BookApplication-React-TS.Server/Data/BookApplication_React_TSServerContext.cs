using Microsoft.EntityFrameworkCore;
using BookApplication_React_TS.Server.Models;

namespace BookApplication_React_TS.Server.Data
{
    public class BookApplication_React_TSServerContext(DbContextOptions<BookApplication_React_TSServerContext> options) : DbContext(options)
    {
        public DbSet<Book> Book { get; set; } = default!;

        public DbSet<User> User { get; set; } = default!;

        public DbSet<UserFollow> Follows { get; set; } = default!;

        public DbSet<Review> Reviews { get; set; } = default!;

        public DbSet<Note> Notes { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>(entity =>
            {
                entity.Property(b => b.Description).HasColumnType("nvarchar(max)");
                entity.Property(b => b.CoverUrl).HasMaxLength(500);
            });

            modelBuilder.Entity<Note>(entity =>
            {
                entity.Property(n => n.Content).HasColumnType("nvarchar(max)");
                entity.Property(n => n.Title).HasMaxLength(200);

                entity.HasOne(n => n.Book)
                    .WithMany()
                    .HasForeignKey(n => n.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(n => n.User)
                    .WithMany()
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Username).HasMaxLength(50);
                entity.Property(u => u.Email).HasMaxLength(256);
                entity.Property(u => u.PasswordHash).HasMaxLength(512);
                entity.Property(u => u.Bio).HasMaxLength(500);
                entity.Property(u => u.ReadingGoal).IsRequired(false);

                modelBuilder.Entity<UserFollow>()
                    .HasOne(f => f.Follower)
                    .WithMany()
                    .HasForeignKey(f => f.FollowerId)
                    .OnDelete(DeleteBehavior.NoAction);

                modelBuilder.Entity<UserFollow>()
                    .HasOne(f => f.Following)
                    .WithMany()
                    .HasForeignKey(f => f.FollowingId)
                    .OnDelete(DeleteBehavior.NoAction);

                modelBuilder.Entity<Review>(entity =>
                {
                    entity.HasIndex(r => new { r.BookId, r.UserId }).IsUnique();

                    entity.HasOne(r => r.Book)
                        .WithMany()
                        .HasForeignKey(r => r.BookId)
                        .OnDelete(DeleteBehavior.Cascade);

                    entity.HasOne(r => r.User)
                        .WithMany()
                        .HasForeignKey(r => r.UserId)
                        .OnDelete(DeleteBehavior.NoAction);

                    entity.Property(r => r.ReviewText).HasMaxLength(2000);
                    entity.Property(r => r.Stars).IsRequired();
                });
            });
        }
    }
}
