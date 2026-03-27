import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

interface ActivityBookInfo {
    id: number;
    title: string;
    author: string;
    coverUrl: string | null;
    shelf: string;
}

interface ActivityFeedItem {
    type: 'book_added' | 'note_created' | 'highlight_created';
    userId: number;
    username: string;
    timestamp: string;
    book: ActivityBookInfo;
    detail: string | null;
}

const activityMeta: Record<ActivityFeedItem['type'], { icon: string; label: string }> = {
    book_added:        { icon: '📚', label: 'added a book' },
    note_created:      { icon: '✏️',  label: 'wrote a note' },
    highlight_created: { icon: '🔆', label: 'highlighted a passage' },
};

const shelfLabel: Record<string, string> = {
    'reading':      'Reading',
    'read':         'Read',
    'want to read': 'Want to Read',
    'did not finish': 'Did Not Finish',
};

function timeAgo(iso: string): string {
    const utcIso = iso.endsWith('Z') ? iso : iso + 'Z';
    const diff = Date.now() - new Date(utcIso).getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);
    if (mins  <  1) return 'just now';
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days  <  7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}

function avatarInitials(username: string): string {
    return username.slice(0, 2).toUpperCase();
}

const ActivityFeed = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState<ActivityFeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('/api/activity/feed', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(res => res.ok ? res.json() : [])
            .then((data: ActivityFeedItem[]) => setItems(data))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Page header */}
            <div className="max-w-2xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Community
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    Activity Feed 📰
                </h1>
                <p className="text-stone-400 mt-2 text-sm">See what the readers you follow have been up to.</p>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-8">
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-amber-50 border border-orange-100 rounded-2xl p-5 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-full bg-orange-100" />
                                    <div className="flex-1">
                                        <div className="h-3 bg-orange-100 rounded w-24 mb-2" />
                                        <div className="h-3 bg-orange-100 rounded w-32" />
                                    </div>
                                    <div className="h-3 bg-orange-100 rounded w-12" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-14 bg-orange-100 rounded-lg flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-orange-100 rounded w-3/4 mb-2" />
                                        <div className="h-3 bg-orange-100 rounded w-1/2 mb-2" />
                                        <div className="h-5 bg-orange-100 rounded-full w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-stone-600 font-medium mb-1">No activity yet</p>
                        <p className="text-stone-400 text-sm mb-6">Follow some readers to see what they're up to.</p>
                        <a
                            href="/users"
                            className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-full shadow transition-all text-sm"
                        >
                            Find readers →
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {items.map((item, idx) => {
                            const meta = activityMeta[item.type];
                            const shelf = shelfLabel[item.book.shelf?.toLowerCase()] ?? item.book.shelf;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => navigate('/activity/detail', { state: item })}
                                    className="flex flex-col bg-amber-50 border border-orange-100 rounded-2xl px-5 py-4 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
                                >
                                    {/* Header row */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <Link
                                            to={`/profile/${item.userId}`}
                                            onClick={e => e.stopPropagation()}
                                            className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm hover:bg-orange-500 transition-colors"
                                        >
                                            {avatarInitials(item.username)}
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/profile/${item.userId}`}
                                                onClick={e => e.stopPropagation()}
                                                className="font-semibold text-stone-700 text-sm hover:text-orange-500 transition-colors"
                                            >
                                                {item.username}
                                            </Link>
                                            <div className="text-stone-400 text-xs mt-0.5">
                                                {meta.icon} {meta.label}
                                            </div>
                                        </div>
                                        <span className="text-xs text-stone-400 flex-shrink-0">{timeAgo(item.timestamp)}</span>
                                    </div>

                                    {/* Book row */}
                                    <div className="flex gap-3 items-start">
                                        {item.book.coverUrl ? (
                                            <img
                                                src={item.book.coverUrl}
                                                alt={item.book.title}
                                                className="w-10 h-14 object-cover rounded-lg flex-shrink-0 shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-10 h-14 bg-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xl">
                                                📖
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-stone-800 text-sm leading-snug truncate">{item.book.title}</p>
                                            <p className="text-stone-400 text-xs mb-2">{item.book.author}</p>
                                            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                                {shelf}
                                            </span>
                                            {item.detail && (
                                                <p className="text-stone-400 text-xs italic mt-2 line-clamp-2">"{item.detail}"</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
