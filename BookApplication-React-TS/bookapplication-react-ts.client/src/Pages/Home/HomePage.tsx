import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';

interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    shelf: string;
    rating: number;
    releaseDate: string;
}

const shelfEmoji: Record<string, string> = {
    'read': '✅',
    'reading': '📖',
    'want to read': '🔖',
    'did not finish': '🚧',
};

const Home = () => {
    const { isLoggedIn, token } = useAuth();
    const [recentBooks, setRecentBooks] = useState<Book[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(false);

    useEffect(() => {
        if (!isLoggedIn || !token) return;
        setLoadingBooks(true);
        fetch('/api/Books', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : [])
            .then((data: Book[]) => {
                // Take the last 3 added (highest ids)
                const sorted = [...data].sort((a, b) => b.id - a.id).slice(0, 3);
                setRecentBooks(sorted);
            })
            .finally(() => setLoadingBooks(false));
    }, [isLoggedIn, token]);


    return (
        <div className="min-h-screen bg-amber-50 font-serif">

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-amber-50 px-6 pt-16 pb-0 min-h-96">

                {/* Diagonal orange slab — the asymmetric anchor */}
                <div
                    className="absolute bottom-0 right-0 w-2/3 h-full bg-orange-400 z-0"
                    style={{ clipPath: 'polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                />

                {/* Warm texture stripe */}
                <div
                    className="absolute bottom-0 right-0 w-2/3 h-full bg-orange-300 opacity-40 z-0"
                    style={{ clipPath: 'polygon(22% 0%, 36% 0%, 18% 100%, 4% 100%)' }}
                />

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 pb-16">

                    {/* LEFT — text block */}
                    <div className="flex-1 md:pr-8">
                        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
                            Your personal library
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-stone-800 leading-tight mb-5">
                            {isLoggedIn ? (
                                <>Welcome<br />back! 👋</>
                            ) : (
                                <>Every book<br />has a<br /><span className="text-orange-400">home.</span></>
                            )}
                        </h1>
                        <p className="text-stone-500 text-lg leading-relaxed mb-8 max-w-sm">
                            {isLoggedIn
                                ? 'Your library is waiting. Pick up where you left off.'
                                : "Track what you've read, discover what's next, and keep your whole collection in one cosy place."}
                        </p>

                        {isLoggedIn ? (
                            <div className="flex flex-wrap gap-3">
                                <a href="/books" className="bg-orange-400 text-white font-semibold px-7 py-3 rounded-full shadow hover:bg-orange-500 transition-all">
                                    My Library 📖
                                </a>
                                <a href="/books/add" className="bg-white border-2 border-orange-400 text-orange-500 font-semibold px-7 py-3 rounded-full hover:bg-orange-50 transition-all">
                                    + Add a Book
                                </a>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                <a href="/register" className="bg-orange-400 text-white font-semibold px-7 py-3 rounded-full shadow hover:bg-orange-500 transition-all">
                                    Start for free →
                                </a>
                                <a href="/login" className="bg-white border-2 border-orange-300 text-orange-500 font-semibold px-7 py-3 rounded-full hover:bg-orange-50 transition-all">
                                    Sign In
                                </a>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — floating book stack */}
                    <div className="flex-1 flex justify-center items-end gap-3 pb-2 mt-8 md:mt-0">
                        {[
                            { emoji: '🌙', title: 'Midnight Library', color: 'bg-violet-100 border-violet-200', rotate: '-rotate-6', height: 'h-52' },
                            { emoji: '🏔️', title: 'Into the Wild', color: 'bg-green-100 border-green-200', rotate: 'rotate-2', height: 'h-64' },
                            { emoji: '🔥', title: 'Fahrenheit 451', color: 'bg-orange-100 border-orange-200', rotate: 'rotate-6', height: 'h-48' },
                        ].map(book => (
                            <div
                                key={book.title}
                                className={`${book.height} w-28 ${book.color} border-2 rounded-2xl shadow-lg ${book.rotate} flex flex-col items-center justify-center gap-2 p-3 transition-transform hover:scale-105 hover:rotate-0 cursor-pointer`}
                            >
                                <span className="text-4xl">{book.emoji}</span>
                                <span className="text-xs text-center text-stone-500 font-medium leading-tight">{book.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── RECENT BOOKS (logged in) ──────────────────────────── */}
            {isLoggedIn && (
                <section className="max-w-4xl mx-auto px-6 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-stone-800">Recently Added</h2>
                        <a href="/books" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                            View all →
                        </a>
                    </div>

                    {loadingBooks ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 animate-pulse">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full mb-3" />
                                    <div className="h-4 bg-orange-50 rounded mb-2 w-3/4" />
                                    <div className="h-3 bg-orange-50 rounded mb-4 w-1/2" />
                                    <div className="h-5 bg-orange-50 rounded-full w-16" />
                                </div>
                            ))}
                        </div>
                    ) : recentBooks.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center border border-orange-100 shadow-sm">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-stone-500 mb-4">No books yet — add your first one!</p>
                            <a href="/books/add" className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-full shadow transition-all text-sm">
                                + Add a Book
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {recentBooks.map(book => (
                                <a
                                    key={book.id}
                                    href={`/books/${book.id}`}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                                >
                                    <div className="text-4xl mb-3">
                                        {shelfEmoji[book.shelf?.toLowerCase()] ?? '📚'}
                                    </div>
                                    <h3 className="font-bold text-stone-800 text-lg leading-snug mb-1">{book.title}</h3>
                                    <p className="text-stone-500 text-sm mb-3">{book.author}</p>
                                    <span className="inline-block bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
                                        {book.genre || 'No genre'}
                                    </span>
                                </a>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ── FEATURES (logged out) ────────────────────────────── */}
            {!isLoggedIn && (
                <section className="max-w-4xl mx-auto px-6 py-16">
                    <h2 className="text-2xl font-bold text-stone-800 text-center mb-10">
                        Everything your reading life needs 🍵
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { emoji: '📖', title: 'Track your reads', desc: 'Log every book you finish and build your personal reading history.' },
                            { emoji: '🔖', title: 'Organise your library', desc: 'Sort by genre, author or status — your collection, your way.' },
                            { emoji: '✏️', title: 'Add & edit freely', desc: 'Add new books in seconds and edit details whenever you like.' },
                        ].map(f => (
                            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 text-center">
                                <div className="text-4xl mb-3">{f.emoji}</div>
                                <h3 className="font-bold text-stone-800 mb-2">{f.title}</h3>
                                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA (logged out) ─────────────────────────────────── */}
            {!isLoggedIn && (
                <section className="bg-gradient-to-r from-orange-400 to-amber-400 mx-6 mb-16 rounded-3xl px-8 py-14 text-center max-w-3xl lg:mx-auto shadow-md">
                    <div className="text-5xl mb-4">🌟</div>
                    <h2 className="text-3xl font-bold text-white mb-3">Ready to start your library?</h2>
                    <p className="text-orange-50 mb-8">Join and start tracking your books today — completely free.</p>
                    <a
                        href="/register"
                        className="bg-white text-orange-500 font-bold px-10 py-3 rounded-full shadow hover:shadow-md hover:bg-orange-50 transition-all"
                    >
                        Create your library →
                    </a>
                </section>
            )}

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <footer className="text-center text-stone-400 text-sm py-8">
                Built with 📚 & ☕ by Denice
            </footer>
        </div>
    );
};

export default Home;