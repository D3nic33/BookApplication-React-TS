import { useEffect, useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';

interface Highlight {
    id: number;
    bookId: number;
    userId: number;
    content: string;
    pageNumber: number;
    createdAt: string;
    updatedAt?: string;
}

interface HighlightSectionProps {
    bookId: number;
}

const HighlightSection = ({ bookId }: HighlightSectionProps) => {
    const { token } = useAuth();
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);
    const [content, setContent] = useState('');
    const [pageNumber, setPageNumber] = useState<number | ''>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const fetchHighlights = async () => {
        const res = await fetch(`/api/highlights/book/${bookId}`, { headers });
        if (res.ok) setHighlights(await res.json());
    };

    useEffect(() => {
        fetchHighlights().finally(() => setLoading(false));
    }, [bookId]);

    const resetForm = () => {
        setContent('');
        setPageNumber('');
        setError('');
        setShowForm(false);
        setEditingHighlight(null);
    };

    const handleCreate = async () => {
        if (!content.trim() || pageNumber === '') { setError('Page number and content are required.'); return; }
        setSubmitting(true);
        setError('');
        const res = await fetch(`/api/highlights/book/${bookId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ content, pageNumber: Number(pageNumber) }),
        });
        if (res.ok) {
            await fetchHighlights();
            resetForm();
        } else {
            const data = await res.json();
            setError(data.message ?? 'Failed to save highlight.');
        }
        setSubmitting(false);
    };

    const handleUpdate = async () => {
        if (!editingHighlight) return;
        if (!content.trim() || pageNumber === '') { setError('Page number and content are required.'); return; }
        setSubmitting(true);
        setError('');
        const res = await fetch(`/api/highlights/${editingHighlight.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ content, pageNumber: Number(pageNumber) }),
        });
        if (res.ok) {
            await fetchHighlights();
            resetForm();
        } else {
            const data = await res.json();
            setError(data.message ?? 'Failed to update highlight.');
        }
        setSubmitting(false);
    };

    const handleDelete = async (highlightId: number) => {
        const res = await fetch(`/api/highlights/${highlightId}`, { method: 'DELETE', headers });
        if (res.ok) await fetchHighlights();
    };

    const startEdit = (highlight: Highlight) => {
        setEditingHighlight(highlight);
        setContent(highlight.content);
        setPageNumber(highlight.pageNumber);
        setError('');
        setShowForm(false);
    };

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (loading) return <p className="text-stone-400 text-sm animate-pulse py-2">Loading highlights...</p>;

    const inputClass = 'w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200';

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">
                    Highlights {highlights.length > 0 && `(${highlights.length})`}
                </span>
                {!showForm && !editingHighlight && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-xs text-orange-400 hover:text-orange-500 font-semibold transition-colors"
                    >
                        + New highlight
                    </button>
                )}
            </div>

            {/* Create form */}
            {showForm && (
                <div className="bg-amber-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-3">
                    <input
                        type="number"
                        min={1}
                        value={pageNumber}
                        onChange={e => setPageNumber(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Page number"
                        className={inputClass}
                    />
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write your highlight here..."
                        rows={6}
                        className={`${inputClass} resize-y`}
                    />
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}
                            disabled={submitting}
                            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-full text-sm transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : 'Save highlight'}
                        </button>
                        <button onClick={resetForm} className="flex-1 bg-white border-2 border-orange-200 text-orange-400 font-semibold py-2 rounded-full text-sm transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Edit form */}
            {editingHighlight && (
                <div className="bg-amber-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-3">
                    <span className="text-xs text-stone-400 font-semibold">Edit highlight</span>
                    <input
                        type="number"
                        min={1}
                        value={pageNumber}
                        onChange={e => setPageNumber(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Page number"
                        className={inputClass}
                    />
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write your highlight here..."
                        rows={6}
                        className={`${inputClass} resize-y`}
                    />
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            disabled={submitting}
                            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-full text-sm transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : 'Save changes'}
                        </button>
                        <button onClick={resetForm} className="flex-1 bg-white border-2 border-orange-200 text-orange-400 font-semibold py-2 rounded-full text-sm transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Highlights list */}
            {highlights.length === 0 && !showForm ? (
                <p className="text-stone-300 text-sm italic">No highlights yet. Add one!</p>
            ) : (
                highlights.map(highlight => (
                    <div key={highlight.id} className="bg-white border border-orange-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs text-orange-400 font-bold">p. {highlight.pageNumber}</span>
                                <span className="text-xs text-stone-300">
                                    {new Date(highlight.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                    {highlight.updatedAt && ' (edited)'}
                                </span>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => startEdit(highlight)} className="text-xs text-orange-400 hover:text-orange-500 font-semibold transition-colors">Edit</button>
                                <span className="text-stone-200">|</span>
                                <button onClick={() => handleDelete(highlight.id)} className="text-xs text-red-400 hover:text-red-500 font-semibold transition-colors">Delete</button>
                            </div>
                        </div>
                        <div className="text-stone-500 text-sm leading-relaxed whitespace-pre-wrap">
                            {expandedIds.has(highlight.id) || highlight.content.length <= 200
                                ? highlight.content
                                : `${highlight.content.slice(0, 200)}...`
                            }
                        </div>
                        {highlight.content.length > 200 && (
                            <button onClick={() => toggleExpand(highlight.id)} className="text-xs text-orange-400 hover:text-orange-500 font-semibold self-start transition-colors">
                                {expandedIds.has(highlight.id) ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default HighlightSection;
