interface ReadingProgressProps {
    currentPage: number | null;
    totalPages: number | null;
    onCurrentPageChange: (val: number | null) => void;
    onTotalPagesChange: (val: number | null) => void;
}

const ReadingProgressTracker = ({
    currentPage,
    totalPages,
    onCurrentPageChange,
    onTotalPagesChange,
}: ReadingProgressProps) => {

    const progressPercent =
        totalPages && totalPages > 0 && currentPage != null
            ? Math.min(Math.round((currentPage / totalPages) * 100), 100)
            : null;

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-stone-600">Reading Progress</label>

            {/* Page inputs */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 flex-1">
                    <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">Current Page</span>
                    <input
                        type="number"
                        min={0}
                        max={totalPages ?? undefined}
                        value={currentPage ?? ""}
                        onChange={e =>
                            onCurrentPageChange(e.target.value === "" ? null : Math.max(0, parseInt(e.target.value)))
                        }
                        placeholder="0"
                        className="w-full bg-amber-50 border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>

                <span className="text-stone-300 font-bold mt-5">/</span>

                <div className="flex flex-col gap-1 flex-1">
                    <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">Total Pages</span>
                    <input
                        type="number"
                        min={1}
                        value={totalPages ?? ""}
                        onChange={e =>
                            onTotalPagesChange(e.target.value === "" ? null : Math.max(1, parseInt(e.target.value)))
                        }
                        placeholder="e.g. 320"
                        className="w-full bg-amber-50 border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>
            </div>

            {/* Progress bar */}
            {progressPercent !== null && (
                <div className="flex flex-col gap-1">
                    <div className="w-full bg-orange-100 rounded-full h-3">
                        <div
                            className="bg-orange-400 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-stone-400 text-right">
                        {progressPercent}% complete
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReadingProgressTracker;