import { useRef } from 'react';
import { useState } from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
}

function WantToReadOverview() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [books] = useState<Book[]>([]);

    const scroll = (direction: "left" | "right") => {
        scrollRef.current?.scrollBy({
            left: direction === "right" ? 300 : -300,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative flex items-center">

            {/* Left button */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md"
            >

            </button>

            {/* Scrollable list */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-12 py-4 w-full"
            >
                {books.map((book) => (
                    <div key={book.id} className="flex flex-col items-center min-w-28">
                        <div className="w-28 h-44 bg-gray-200 rounded-lg shadow-md" />
                        <p className="text-center mt-2 text-sm font-medium">{book.title}</p>
                        <p className="text-center text-sm text-gray-500">{book.author}</p>
                    </div>
                ))}
            </div>

            {/* Right button */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md"
            >
            </button>

        </div>
    );
}

export default WantToReadOverview
