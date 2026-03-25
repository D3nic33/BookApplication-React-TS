import { useState } from "react";

interface StarRatingProps {
    value: number;
    onChange: (val: number) => void;
    max?: number;
}

function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        setHovered(x < width / 2 ? star - 0.5 : star);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        onChange(x < width / 2 ? star - 0.5 : star);
    };

    const display = hovered ?? value;

    return (
        <div className="flex flex-col w-80 mx-auto items-center justify-center py-3">
            <div>Rating</div>
            <div className="flex flex-row gap-1">
                {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
                    const full = display >= star;
                    const half = !full && display >= star - 0.5;

                    return (
                        <button
                            key={star}
                            type="button"
                            onMouseMove={(e) => handleMouseMove(e, star)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={(e) => handleClick(e, star)}
                            className="flex flex-row relative text-3xl transition-transform hover:scale-110 focus:outline-none w-8 h-8"
                        >
                            {/* Gray base star */}
                            <span className="text-gray-300 absolute inset-0 flex items-center justify-center">★</span>

                            {/* Filled overlay — full or half */}
                            {(full || half) && (
                                <span
                                    className="text-yellow-400 absolute inset-0 flex items-center justify-center overflow-hidden"
                                    style={{ clipPath: half ? "inset(0 50% 0 0)" : "none" }}
                                >
                                    ★
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}


export default StarRating;