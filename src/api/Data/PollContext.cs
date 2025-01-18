using Microsoft.EntityFrameworkCore;
using group_rank.API.Models;

namespace group_rank.API.Data
{
    public class PollContext : DbContext
    {
        public PollContext(DbContextOptions<PollContext> options) : base(options) { }

        public DbSet<Poll> Polls { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<Ranking> Rankings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure GUID properties for MySQL
            modelBuilder.Entity<Poll>()
                .Property(p => p.Id)
                .HasColumnType("char(36)");

            modelBuilder.Entity<Option>()
                .Property(o => o.Id)
                .HasColumnType("char(36)");

            modelBuilder.Entity<Ranking>()
                .Property(r => r.Id)
                .HasColumnType("char(36)");

            // Configure relationships
            modelBuilder.Entity<Poll>()
                .HasMany(p => p.Options)
                .WithOne(o => o.Poll)
                .HasForeignKey(o => o.PollId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Option>()
                .HasMany(o => o.Rankings)
                .WithOne(r => r.Option)
                .HasForeignKey(r => r.OptionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
