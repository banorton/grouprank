using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace group_rank.API.Models
{
    public class Poll
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Title { get; set; }

        public bool IsFinished { get; set; }
        public required List<Option> Options { get; set; }
    }

    public class Option
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();


        public required string Name { get; set; }

        // Foreign key to Poll
        public Guid PollId { get; set; }

        [ForeignKey("PollId")]
        [JsonIgnore]
        public Poll? Poll { get; set; }

        public List<Ranking> Rankings { get; set; } = new List<Ranking>();

        [NotMapped]
        public double AverageRank { get; set; }
    }

    public class Ranking
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid OptionId { get; set; }

        [ForeignKey("OptionId")]
        public Option? Option { get; set; }

        public int Rank { get; set; }
    }

    public class RankingSubmission
    {
        public Guid OptionId { get; set; }
        public int Rank { get; set; }
    }

    public class OptionResultDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public double AverageRank { get; set; }
    }
}
