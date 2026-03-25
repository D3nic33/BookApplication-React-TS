import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    rating: number;
    description: string;
}

interface Shelf {
    shelf: string;
    books: Book[];
}

interface PublicUserProfile {
    id: number;
    username: string;
    bio: string;
    readingGoal: number | null;
}

interface FollowCounts {
    followers: number;
    following: number;
}

const shelfEmoji: Record<string, string> = {
    read: "✅",
    reading: "📖",
    "want to read": "🔖",
};

const PublicProfile = () => {
    const { userId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<PublicUserProfile | null>(null);
    const [booksRead, setBooksRead] = useState(0);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeShelf, setActiveShelf] = useState<string | null>(null);
    const [followCounts, setFollowCounts] = useState<FollowCounts>({ followers: 0, following: 0 });

    useEffect(() => {
        Promise.all([
            fetch(`/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => {
                if (!r.ok) throw new Error(`Profile fetch failed: ${r.status}`);
                return r.json();
            }),

            fetch(`/api/follow/isfollowing/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => {
                if (!r.ok) throw new Error(`IsFollowing fetch failed: ${r.status}`);
                return r.json();
            }),

            fetch(`/api/books/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => {
                if (!r.ok) throw new Error(`Books fetch failed: ${r.status}`);
                return r.json();
            }),

            fetch(`/api/follow/${userId}/counts`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => {
                if (!r.ok) throw new Error(`Counts fetch failed: ${r.status}`);
                return r.json();
            }),
        ]).then(([profileData, followData, shelvesData, countsData]) => {
            setProfile(profileData);
            setIsFollowing(followData.isFollowing);
            setShelves(shelvesData);
            setFollowCounts(countsData);

            const readShelf = shelvesData.find((s: Shelf) => s.shelf.toLowerCase() === "read");
            setBooksRead(readShelf?.books.length ?? 0);

            if (shelvesData.length > 0) setActiveShelf(shelvesData[0].shelf);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [userId]);

    const handleFollow = async () => {
        await fetch(`/api/follow/${userId}`, {
            method: isFollowing ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(prev => !prev);
        setFollowCounts(prev => ({
            ...prev,
            followers: isFollowing ? prev.followers - 1 : prev.followers + 1
        }));
    };

    if (loading) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <p className="text-stone-400 animate-pulse">Loading profile... 📖</p>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <p className="text-red-400">Could not load profile.</p>
        </div>
    );

    const goalProgress = profile.readingGoal
        ? Math.min((booksRead / profile.readingGoal) * 100, 100)
        : 0;

    const activeBooks = shelves.find(s => s.shelf === activeShelf)?.books ?? [];

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Back button */}
            <div className="max-w-2xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-orange-400 hover:text-orange-500 text-sm font-semibold transition-all"
                >
                    ← Back
                </button>
            </div>

            {/* Page header */}
            <div className="max-w-2xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Reader Profile
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    {profile.username} 📖
                </h1>
            </div>

            {/* Profile Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-8 mb-6">
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="w-24 h-24 rounded-full bg-orange-400 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800">{profile.username}</h2>

                    {/* Follower / Following counts */}
                    <div className="flex gap-6 mt-1">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-stone-800">{followCounts.followers}</span>
                            <span className="text-xs text-stone-400 uppercase tracking-widest">Followers</span>
                        </div>
                        <div className="w-px bg-orange-100" />
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-stone-800">{followCounts.following}</span>
                            <span className="text-xs text-stone-400 uppercase tracking-widest">Following</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-amber-50 border border-orange-100 rounded-2xl px-5 py-3 text-center text-stone-500 text-sm w-full">
                        {profile.bio
                            ? profile.bio
                            : <span className="italic text-stone-300">No bio yet.</span>
                        }
                    </div>
                </div>

                <div className="h-px bg-orange-100 mb-5" />

                {/* Reading Goal */}
                {profile.readingGoal && (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm font-medium text-stone-700">
                            <span>📚 Reading Goal</span>
                            <span className="text-orange-400 font-semibold">{profile.readingGoal} books this year</span>
                        </div>
                        <div className="w-full bg-orange-100 rounded-full h-3">
                            <div
                                className="bg-orange-400 h-3 rounded-full transition-all"
                                style={{ width: `${goalProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-stone-400 text-right">
                            {booksRead} / {profile.readingGoal} books read
                        </p>
                    </div>
                )}
            </div>

            {/* Follow button */}
            <div className="max-w-2xl mx-auto mb-8">
                <button
                    onClick={handleFollow}
                    className={`w-full font-semibold py-3 rounded-full shadow transition-all ${isFollowing
                            ? 'bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-400'
                            : 'bg-orange-400 hover:bg-orange-500 text-white'
                        }`}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'} {profile.username}
                </button>
            </div>

            {/* Shelves */}
            {shelves.length > 0 ? (
                <div className="max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-stone-800 mb-4">📚 Their Shelves</h3>

                    {/* Shelf tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {shelves.map(s => (
                            <button
                                key={s.shelf}
                                onClick={() => setActiveShelf(s.shelf)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeShelf === s.shelf
                                        ? 'bg-orange-400 text-white'
                                        : 'bg-white border border-orange-100 text-stone-500 hover:border-orange-300'
                                    }`}
                            >
                                {shelfEmoji[s.shelf.toLowerCase()] ?? "📁"} {s.shelf} ({s.books.length})
                            </button>
                        ))}
                    </div>

                    {/* Book list */}
                    <div className="flex flex-col gap-4">
                        {activeBooks.map(book => (
                            <div key={book.id} className="bg-white rounded-2xl border border-orange-100 px-6 py-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-stone-800">{book.title}</p>
                                        <p className="text-sm text-stone-400">{book.author}</p>
                                        {book.description && (
                                            <p className="text-sm text-stone-500 mt-2">{book.description}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                                        <span className="text-xs bg-orange-50 text-orange-400 border border-orange-100 px-2 py-0.5 rounded-full">
                                            {book.genre}
                                        </span>
                                        {book.rating > 0 && (
                                            <span className="text-xs text-stone-400">⭐ {book.rating}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-orange-100 p-8 text-center">
                    <p className="italic text-stone-300 text-sm">This reader hasn't added any books yet.</p>
                </div>
            )}
        </div>
    );
};

export default PublicProfile;