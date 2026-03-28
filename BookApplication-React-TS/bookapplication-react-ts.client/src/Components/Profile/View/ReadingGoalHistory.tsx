import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";

interface YearlyReading {
    year: number;
    goal: number | null;
    booksRead: number;
}

const ReadingGoalHistory = () => {
    const { token } = useAuth();
    const [history, setHistory] = useState<YearlyReading[]>([]);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        fetch("/api/user/me/reading-history", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => { setHistory(data); setLoading(false); });
    }, []);

    if (loading || history.length === 0) return null;

    return (
        <div className="max-w-xl mx-auto mb-6">
            <div className="mb-4">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
                    Reading Goal History
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {[...history].reverse().map(entry => {
                    const isCurrentYear = entry.year === currentYear;
                    const progress = entry.goal ? Math.min((entry.booksRead / entry.goal) * 100, 100) : 0;
                    const met = entry.goal !== null && entry.booksRead >= entry.goal;

                    return (
                        <div
                            key={entry.year}
                            className={`bg-white rounded-2xl border shadow-sm p-5 ${isCurrentYear ? "border-orange-300 ring-1 ring-orange-200" : "border-orange-100"}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-bold text-stone-800">{entry.year}</span>
                                    {isCurrentYear && (
                                        <span className="text-xs bg-orange-100 text-orange-500 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            This year
                                        </span>
                                    )}
                                    {met && !isCurrentYear && (
                                        <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            Goal met
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-orange-400">
                                    {entry.booksRead} {entry.booksRead === 1 ? "book" : "books"} read
                                </span>
                            </div>

                            {entry.goal !== null ? (
                                <>
                                    <div className="w-full bg-orange-100 rounded-full h-2.5 mb-2">
                                        <div
                                            className={`h-2.5 rounded-full transition-all ${met ? "bg-green-400" : "bg-orange-400"}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-stone-400 text-right">
                                        {entry.booksRead} / {entry.goal} goal
                                    </p>
                                </>
                            ) : (
                                <p className="text-xs text-stone-300 italic">No goal set</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReadingGoalHistory;
