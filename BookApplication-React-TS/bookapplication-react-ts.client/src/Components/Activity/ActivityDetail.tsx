import { useLocation, useNavigate, Link } from 'react-router-dom';

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
    book_added: { icon: '📚', label: 'added a book' },
    note_created: { icon: '✏️', label: 'wrote a note' },
    highlight_created: { icon: '🔆', label: 'highlighted a passage' },
};

const shelfLabel: Record<string, string> = {
    'reading': 'Reading',
    'read': 'Read',
    'want to read': 'Want to Read',
    'did not finish': 'Did Not Finish',
};

function avatarInitials(username: string): string {
    return username.slice(0, 2).toUpperCase();
}

function formatDate(iso: string): string {
    const utcIso = iso.endsWith('Z') ? iso : iso + 'Z';
    return new Date(utcIso).toLocaleString(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

function ActivityDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state as ActivityFeedItem | null;

    if (!item) {
        return (
            <div className="min-h-screen bg-amber-50 px-4 sm:px-6 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-stone-600 font-medium mb-4">Activity not found.</p>
                    <Link
                        to="/activity"
                        className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-full shadow transition-all text-sm"
                    >
                        ← Back to feed
                    </Link>
                </div>
            </div>
        );
    }

    const meta = activityMeta[item.type];
    const shelf = shelfLabel[item.book.shelf?.toLowerCase()] ?? item.book.shelf;

    return (
        <div className="min-h-screen bg-amber-50 px-4 sm:px-6 py-12">

            {/* Back button */}
            <div className="max-w-xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-stone-400 hover:text-orange-500 transition-colors flex items-center gap-1"
                >
                    ← Back to feed
                </button>
            </div>

            {/* Header */}
            <div className="max-w-xl mx-auto mb-6">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Activity
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    {meta.icon} {meta.label.charAt(0).toUpperCase() + meta.label.slice(1)}
                </h1>
            </div>

            {/* Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-5 sm:p-8 flex flex-col gap-6">

                {/* User row */}
                <div className="flex items-center gap-3">
                    <Link
                        to={`/profile/${item.userId}`}
                        className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm hover:bg-orange-500 transition-colors"
                    >
                        {avatarInitials(item.username)}
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Link
                            to={`/profile/${item.userId}`}
                            className="font-semibold text-stone-700 hover:text-orange-500 transition-colors"
                        >
                            {item.username}
                        </Link>
                        <p className="text-stone-400 text-xs mt-0.5">{formatDate(item.timestamp)}</p>
                    </div>
                </div>

                <div className="h-px bg-orange-100" />

                {/* Book row */}
                <div className="flex gap-4 items-start">
                    {item.book.coverUrl ? (
                        <img
                            src={item.book.coverUrl}
                            alt={item.book.title}
                            className="w-16 h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
                        />
                    ) : (
                        <div className="w-16 h-24 bg-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl">
                            📖
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800 text-lg leading-snug">{item.book.title}</p>
                        <p className="text-stone-400 text-sm mb-3">{item.book.author}</p>
                        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            {shelf}
                        </span>
                    </div>
                </div>

                {/* Detail (note or highlight) */}
                {item.detail && (
                    <>
                        <div className="h-px bg-orange-100" />
                        <div className="bg-amber-50 border border-orange-100 rounded-2xl p-4">
                            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
                                {item.type === 'note_created' ? 'Note' : 'Highlight'}
                            </p>
                            <p className="text-stone-600 text-sm leading-relaxed italic">"{item.detail}"</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ActivityDetail;
