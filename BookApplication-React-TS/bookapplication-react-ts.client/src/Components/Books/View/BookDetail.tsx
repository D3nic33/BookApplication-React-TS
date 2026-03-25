import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import StarRatingShow from '../../Rating/StarRatingShow';
import ReviewSection from '../Review/ReviewSection';

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
    description?: string;
}

const shelfEmoji: Record<string, string> = {
    'read': '✅',
    'reading': '📖',
    'want to read': '🔖',
    'did not finish': '🚧',
};

const shelfColor: Record<string, string> = {
    'read': 'bg-green-100 text-green-700',
    'reading': 'bg-blue-100 text-blue-700',
    'want to read': 'bg-violet-100 text-violet-700',
    'did not finish': 'bg-stone-100 text-stone-500',
};

const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/Books/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (res.status === 401) { navigate('/login'); return null; }
                if (!res.ok) { navigate('/books'); return null; }
                return res.json();
            })
            .then(data => {
                if (data) setBook(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <p className="text-stone-400 animate-pulse">Loading book... 📖</p>
        </div>
    );

    if (!book) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <p className="text-red-400">Could not load book.</p>
        </div>
    );

    const shelfKey = book.shelf?.toLowerCase();
    const emoji = shelfEmoji[shelfKey] ?? '📚';
    const badgeClass = shelfColor[shelfKey] ?? 'bg-orange-100 text-orange-600';
    const isReadShelf = shelfKey === 'read';

    const formattedDate = book.releaseDate
        ? new Date(book.releaseDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
        })
        : 'Unknown';

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Back link */}
            <div className="max-w-xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-orange-400 hover:text-orange-500 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* Main card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">

                {/* Colourful top banner */}
                <div className="bg-gradient-to-r from-orange-400 to-amber-300 px-8 py-10 flex items-end gap-6">
                    <div className="w-24 h-36 bg-white/30 rounded-xl border-2 border-white/50 shadow-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-5xl">{emoji}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white leading-tight mb-1">
                            {book.title}
                        </h1>
                        <p className="text-orange-100 text-sm font-medium">{book.author}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="px-8 py-6 flex flex-col gap-5">

                    {/* Shelf badge */}
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
                            {emoji} {book.shelf}
                        </span>
                    </div>

                    <div className="h-px bg-orange-50" />

                    {/* Description */}
                    {book.description && (
                        <>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">Description</span>
                                <p className="text-stone-600 text-sm leading-relaxed">{book.description}</p>
                            </div>
                            <div className="h-px bg-orange-50" />
                        </>
                    )}

                    {/* Info rows */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">Genre</span>
                            <span className="text-stone-700 font-medium">{book.genre || '—'}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">Released</span>
                            <span className="text-stone-700 font-medium">{formattedDate}</span>
                        </div>

                        {isReadShelf && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">Your Rating</span>
                                <StarRatingShow rating={book.rating ?? 0} />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-orange-50" />

                    {/* Reviews */}
                    <ReviewSection bookId={book.id} isReadShelf={isReadShelf} />

                    <div className="h-px bg-orange-50" />

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={() => navigate(`/books/${book.id}/edit`)}
                            className="flex-1 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-full shadow transition-all"
                        >
                            Edit Book ✏️
                        </button>
                        <button
                            onClick={() => navigate('/books')}
                            className="flex-1 bg-white border-2 border-orange-200 text-orange-400 hover:bg-orange-50 font-semibold py-3 rounded-full transition-all"
                        >
                            My Library 📚
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookDetail;