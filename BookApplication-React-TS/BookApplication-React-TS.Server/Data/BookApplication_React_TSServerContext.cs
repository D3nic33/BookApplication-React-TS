using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BookApplication_React_TS.Server.Models;

namespace BookApplication_React_TS.Server.Data
{
    public class BookApplication_React_TSServerContext : DbContext
    {
        public BookApplication_React_TSServerContext (DbContextOptions<BookApplication_React_TSServerContext> options)
            : base(options)
        {
        }

        public DbSet<BookApplication_React_TS.Server.Models.Book> Book { get; set; } = default!;
    }
}
