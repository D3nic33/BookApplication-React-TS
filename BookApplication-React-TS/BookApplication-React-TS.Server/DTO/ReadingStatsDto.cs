namespace BookApplication_React_TS.Server.DTO
{
    public record GenreStatDto(string Genre, int Count);

    public record ReadingStatsDto(
        int BooksReadThisMonth,
        int BooksReadThisYear,
        int PagesReadThisMonth,
        IEnumerable<GenreStatDto> GenreBreakdownThisMonth
    );
}
