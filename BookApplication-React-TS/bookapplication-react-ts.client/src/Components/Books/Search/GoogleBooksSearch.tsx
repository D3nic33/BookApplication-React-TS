import { useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface GoogleBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        publishedDate?: string;
        description?: string;
        categories?: string[];
        pageCount?: number;
        imageLinks?: {
            thumbnail?: string;
        };
    };
}

const GoogleBooksSearch = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GoogleBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/googlebooks/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setResults(data.items ?? []);
        } catch {
            setError('Failed to search books.');
        }
        setLoading(false);
    };

    const handleAdd = async (book: GoogleBook) => {
        const info = book.volumeInfo;
        const newBook = {
            title: info.title ?? '',
            author: info.authors?.join(', ') ?? '',
            releaseDate: info.publishedDate
                ? new Date(info.publishedDate).toISOString().split('T')[0]
                : '',
            genre: info.categories?.[0] ?? '',
            description: info.description ?? '',
            coverUrl: info.imageLinks?.thumbnail ?? '',
            totalPages: info.pageCount ?? null,
            rating: 0,
            shelf: 'Want to Read',
        };

        const res = await fetch('/api/books', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        });

        if (res.ok) {
            const created = await res.json();
            navigate(`/books/${created.id}`);
        } else {
            setError('Failed to add book.');
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 px-4 sm:px-6 py-12">

            <div className="max-w-xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Discover
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    Find a Book 🔍
                </h1>
            </div>

            {/* Search bar */}
            <div className="max-w-xl mx-auto flex gap-2 mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by title, author..."
                    className="flex-1 bg-white border border-orange-100 rounded-full px-5 py-3 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-sm"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-full shadow transition-all disabled:opacity-50"
                >
                    {loading ? '...' : 'Search'}
                </button>
            </div>

            {/* Manual add fallback */}
            <div className="max-w-xl mx-auto text-center mb-4">
                <p className="text-sm text-stone-400">
                    Can't find what you're looking for?{' '}
                    <Link
                        to="/books/add"
                        className="text-orange-400 hover:text-orange-500 font-medium transition-colors"
                    >
                        Add it manually →
                    </Link>
                </p>
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            {/* Results */}
            <div className="max-w-xl mx-auto flex flex-col gap-4">
                {results.map(book => {
                    const info = book.volumeInfo;
                    const cover = info.imageLinks?.thumbnail;
                    return (
                        <div
                            key={book.id}
                            className="bg-white rounded-3xl border border-orange-100 shadow-sm p-5 flex gap-4 items-start"
                        >
                            {/* Cover */}
                            <div className="w-16 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-orange-50 border border-orange-100 flex items-center justify-center">
                                {cover
                                    ? <img src={cover} alt={info.title} className="w-full h-full object-cover" />
                                    : <span className="text-2xl">📚</span>
                                }
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <p className="font-bold text-stone-800 text-sm leading-tight line-clamp-2">{info.title}</p>
                                <p className="text-xs text-stone-400">{info.authors?.join(', ') ?? 'Unknown author'}</p>
                                {info.categories?.[0] && (
                                    <span className="inline-block bg-orange-100 text-orange-500 text-xs px-2 py-0.5 rounded-full w-fit">
                                        {info.categories[0]}
                                    </span>
                                )}
                                {info.description && (
                                    <p className="text-xs text-stone-400 line-clamp-2 mt-1">{info.description}</p>
                                )}
                            </div>

                            {/* Add button */}
                            <button
                                onClick={() => handleAdd(book)}
                                className="flex-shrink-0 bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition-all"
                            >
                                + Add
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoogleBooksSearch;