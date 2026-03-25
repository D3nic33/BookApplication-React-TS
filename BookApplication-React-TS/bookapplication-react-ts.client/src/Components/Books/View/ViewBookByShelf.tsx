import { useEffect, useState } from 'react';
import StarRatingShow from '../../Rating/StarRatingShow';
import ScrollBar from '../ScrollBar/ScrollBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
    description: string;
}

interface BookShelfProps {
    shelf: string;
    title?: string;
}

const BookShelf = ({ shelf, title }: BookShelfProps) => {
    const { token } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/books/shelf/${shelf}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) return [];
                return res.json();
            })
            .then((data) => {
                setBooks(data);
            });
    }, [shelf]);

    if (books.length === 0) return null;

    return (
        <div>
            {/* Shelf title */}
            <h2 className="text-xl font-bold mb-3 px-4">
                {title}
            </h2>

            <ScrollBar
                items={books}
                keyExtractor={(book) => book.id}
                renderItem={(book) => (
                    <div key={book.id}
                        className="flex flex-col items-center min-w-28 cursor-pointer"
                        onClick={() => navigate(`/books/${book.id}`)}
                    >
                        <div className="w-28 h-44 bg-white/50 rounded-lg shadow-md" />
                        <p className="text-center mt-2 text-sm font-medium">{book.title}</p>
                        <p className="text-center text-sm text-gray-500">{book.author}</p>

                        {/* Show stars when there is a rating */}
                        {shelf === "read" && book.rating != 0 && (
                            <StarRatingShow rating={book.rating ?? 0} />
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default BookShelf;
