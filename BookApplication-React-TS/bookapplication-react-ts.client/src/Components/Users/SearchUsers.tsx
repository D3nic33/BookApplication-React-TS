import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserResult {
    id: string;
    username: string;
    isFollowing: boolean;
}

function SearchUsers() {
    const { token } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (val.trim().length < 2) return setResults([]);

        setLoading(true);
        const response = await fetch(`/api/follow/search?query=${val}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setLoading(false);

        if (!response.ok) return;
        const data = await response.json();
        setResults(data);
    };

    const handleFollow = async (user: UserResult) => {
        await fetch(`/api/follow/${user.id}`, {
            method: user.isFollowing ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        setResults(prev =>
            prev.map(u => u.id === user.id ? { ...u, isFollowing: !u.isFollowing } : u)
        );
    };

    return (
        <div className="min-h-screen bg-amber-50 px-4 sm:px-6 py-12">

            {/* Page header */}
            <div className="max-w-xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Community
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    Find Readers 🔍
                </h1>
                <p className="text-stone-400 mt-2 text-sm">Search for other readers and follow them to see their shelves.</p>
            </div>

            {/* Search Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-5 sm:p-8">

                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={query}
                    onChange={handleSearch}
                    className="w-full border border-orange-200 rounded-full px-5 py-3 text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                />

                {/* Loading */}
                {loading && (
                    <p className="text-center text-stone-400 animate-pulse mt-6 text-sm">Searching... 📖</p>
                )}

                {/* No results */}
                {!loading && query.trim().length >= 2 && results.length === 0 && (
                    <p className="text-center text-stone-300 italic mt-6 text-sm">No users found for "{query}".</p>
                )}

                {/* Results */}
                {results.length > 0 && (
                    <>
                        <div className="h-px bg-orange-100 my-6" />
                        <ul className="flex flex-col gap-3">
                            {results.map(user => (
                                <li
                                    key={user.id}
                                    className="flex items-center justify-between bg-amber-50 border border-orange-100 rounded-2xl px-5 py-3"
                                >
                                    {/* Avatar + username */}
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => navigate(`/profile/${user.id}`)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-stone-700 font-medium">{user.username}</span>
                                    </div>

                                    {/* Follow / Unfollow button */}
                                    <button
                                        onClick={() => handleFollow(user)}
                                        className={`text-sm font-semibold px-4 py-1 rounded-full transition-all ${user.isFollowing
                                                ? 'bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-400'
                                                : 'bg-orange-400 text-white hover:bg-orange-500'
                                            }`}
                                    >
                                        {user.isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchUsers;