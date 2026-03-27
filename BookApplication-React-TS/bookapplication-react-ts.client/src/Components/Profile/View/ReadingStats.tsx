import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";

interface GenreStat {
    genre: string;
    count: number;
}

interface ReadingStatsData {
    booksReadThisMonth: number;
    booksReadThisYear: number;
    pagesReadThisMonth: number;
    genreBreakdownThisMonth: GenreStat[];
}

const ReadingStats = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState<ReadingStatsData | null>(null);

    useEffect(() => {
        fetch("/api/user/me/stats", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);

    if (!stats) return null;

    const monthName = new Date().toLocaleString("default", { month: "long" });
    const year = new Date().getFullYear();
    const maxGenreCount = stats.genreBreakdownThisMonth.length > 0
        ? Math.max(...stats.genreBreakdownThisMonth.map(g => g.count))
        : 1;

    return (
        <div className="max-w-xl mx-auto mb-6">
            {/* Section header */}
            <div className="mb-4">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
                    Reading Stats
                </span>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-orange-400">{stats.booksReadThisMonth}</span>
                    <span className="text-xs text-stone-400 text-center uppercase tracking-wide leading-tight">Books read<br />{monthName}</span>
                </div>
                <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-orange-400">{stats.booksReadThisYear}</span>
                    <span className="text-xs text-stone-400 text-center uppercase tracking-wide leading-tight">Books read<br />{year}</span>
                </div>
                <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-orange-400">{stats.pagesReadThisMonth}</span>
                    <span className="text-xs text-stone-400 text-center uppercase tracking-wide leading-tight">Pages read<br />{monthName}</span>
                </div>
            </div>

            {/* Genre breakdown */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-stone-700 uppercase tracking-widest mb-4">
                    Genre Breakdown — {monthName}
                </h3>
                {stats.genreBreakdownThisMonth.length === 0 ? (
                    <p className="text-stone-300 text-sm italic text-center py-2">No books completed this month.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {stats.genreBreakdownThisMonth.map(g => (
                            <div key={g.genre} className="flex items-center gap-3">
                                <span className="text-sm text-stone-600 w-24 shrink-0 truncate">{g.genre}</span>
                                <div className="flex-1 bg-orange-50 rounded-full h-3">
                                    <div
                                        className="bg-orange-400 h-3 rounded-full transition-all"
                                        style={{ width: `${(g.count / maxGenreCount) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-stone-400 w-12 text-right shrink-0">
                                    {g.count} {g.count === 1 ? "book" : "books"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadingStats;
