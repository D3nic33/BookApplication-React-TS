import { useRef } from 'react';
import { useEffect, useState } from 'react';
import StarRatingShow from '../../Rating/StarRatingShow';
import { useNavigate } from 'react-router-dom';

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
}

interface BookShelfProps {
    shelf: string;
    title?: string;
}

const BookShelf = ({ shelf, title }: BookShelfProps) => {
    const [books, setBooks] = useState<Book[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/books/shelf/${shelf}`)
            .then((res) => res.json())
            .then((data) => setBooks(data));
    }, [shelf]);

    const scroll = (direction: "left" | "right") => {
        scrollRef.current?.scrollBy({
            left: direction === "right" ? 300 : -300,
            behavior: "smooth",
        });
    };

    if (books.length === 0) return null;

    return (
        <div className="mb-10">
            {/* Shelf title */}
            <h2 className="text-xl font-bold mb-3 px-4">
                {title ?? shelf}
            </h2>

            {/* Carousel */}
            <div className="relative flex items-center">

                {/* Left button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md"
                >
                    ‹
                </button>

                {/* Scrollable list */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-12 py-4 w-full"
                >
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="flex flex-col items-center min-w-28 cursor-pointer"
                            onClick={() => navigate(`/books/${book.id}/edit`)}
                        >
                            <div className="w-28 h-44 bg-gray-200 rounded-lg shadow-md" />
                            <p className="text-center mt-2 text-sm font-medium">{book.title}</p>
                            <p className="text-center text-sm text-gray-500">{book.author}</p>

                            {/* Only show rating on "read" shelf */}
                            {shelf === "read" && (
                                <StarRatingShow rating={book.rating ?? 0} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Right button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default BookShelf;
