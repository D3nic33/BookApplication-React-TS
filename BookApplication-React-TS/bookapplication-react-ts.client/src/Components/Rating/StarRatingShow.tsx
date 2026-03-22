interface StarRatingProps {
    rating: number; // e.g. 3.5
    max?: number;   // default 5
}

const StarRating = ({ rating, max = 5 }: StarRatingProps) => {
    return (
        <div className= "flex items-center gap-0.5" >
        {
            Array.from({ length: max }, (_, i) => {
                const full = i + 1 <= rating;
                const half = !full && i + 0.5 < rating;

                return (
                    <svg
                        key={i}
                        viewBox = "0 0 24 24"
                        className = "w-5 h-5"
                        xmlns = "http://www.w3.org/2000/svg"
                    >
                        <defs>
                        <linearGradient id={ `half-${i}` }>
                            <stop offset="50%" stopColor = "#f97316" /> {/* orange-500 */ }
                                < stop offset = "50%" stopColor = "#d1d5db" /> {/* gray-300 */ }
                                    </linearGradient>
                                    </defs>
                        < polygon
                            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                            fill={
                                full
                                ? "#f97316"
                                    : half
                                        ? `url(#half-${i})`
                                        : "#d1d5db"
                            }
                        />
                    </svg>
                );
            })
        }
        </div>
  );
};

export default StarRating;