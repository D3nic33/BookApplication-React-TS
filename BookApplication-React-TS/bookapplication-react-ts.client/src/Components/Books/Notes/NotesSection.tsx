import { useEffect, useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';

interface Note {
    id: number;
    bookId: number;
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

interface NotesSectionProps {
    bookId: number;
}

const NotesSection = ({ bookId }: NotesSectionProps) => {
    const { token } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const fetchNotes = async () => {
        const res = await fetch(`/api/notes/book/${bookId}`, { headers });
        if (res.ok) setNotes(await res.json());
    };

    useEffect(() => {
        fetchNotes().finally(() => setLoading(false));
    }, [bookId]);

    const resetForm = () => {
        setTitle('');
        setContent('');
        setError('');
        setShowForm(false);
        setEditingNote(null);
    };

    const handleCreate = async () => {
        if (!content.trim()) { setError('Note content cannot be empty.'); return; }
        setSubmitting(true);
        setError('');
        const res = await fetch(`/api/notes/book/${bookId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ title, content }),
        });
        if (res.ok) {
            await fetchNotes();
            resetForm();
        } else {
            const data = await res.json();
            setError(data.message ?? 'Failed to save note.');
        }
        setSubmitting(false);
    };

    const handleUpdate = async () => {
        if (!editingNote) return;
        if (!content.trim()) { setError('Note content cannot be empty.'); return; }
        setSubmitting(true);
        setError('');
        const res = await fetch(`/api/notes/${editingNote.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ title, content }),
        });
        if (res.ok) {
            await fetchNotes();
            resetForm();
        } else {
            const data = await res.json();
            setError(data.message ?? 'Failed to update note.');
        }
        setSubmitting(false);
    };

    const handleDelete = async (noteId: number) => {
        const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE', headers });
        if (res.ok) await fetchNotes();
    };

    const startEdit = (note: Note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
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

    if (loading) return <p className="text-stone-400 text-sm animate-pulse py-2">Loading notes...</p>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">
                    Notes {notes.length > 0 && `(${notes.length})`}
                </span>
                {!showForm && !editingNote && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-xs text-orange-400 hover:text-orange-500 font-semibold transition-colors"
                    >
                        + New note
                    </button>
                )}
            </div>

            {/* Create form */}
            {showForm && (
                <div className="bg-amber-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-3">
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Title (optional)"
                        maxLength={200}
                        className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write your note here..."
                        rows={6}
                        className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-y"
                    />
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}
                            disabled={submitting}
                            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-full text-sm transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : 'Save note'}
                        </button>
                        <button
                            onClick={resetForm}
                            className="flex-1 bg-white border-2 border-orange-200 text-orange-400 font-semibold py-2 rounded-full text-sm transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Edit form */}
            {editingNote && (
                <div className="bg-amber-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-3">
                    <span className="text-xs text-stone-400 font-semibold">Edit note</span>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Title (optional)"
                        maxLength={200}
                        className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write your note here..."
                        rows={6}
                        className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-y"
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
                        <button
                            onClick={resetForm}
                            className="flex-1 bg-white border-2 border-orange-200 text-orange-400 font-semibold py-2 rounded-full text-sm transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Notes list */}
            {notes.length === 0 && !showForm ? (
                <p className="text-stone-300 text-sm italic">No notes yet. Add one!</p>
            ) : (
                notes.map(note => (
                    <div key={note.id} className="bg-white border border-orange-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-0.5">
                                {note.title && (
                                    <span className="text-sm font-semibold text-stone-700">{note.title}</span>
                                )}
                                <span className="text-xs text-stone-300">
                                    {new Date(note.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                    {note.updatedAt && ' (edited)'}
                                </span>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => startEdit(note)}
                                    className="text-xs text-orange-400 hover:text-orange-500 font-semibold transition-colors"
                                >
                                    Edit
                                </button>
                                <span className="text-stone-200">|</span>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="text-xs text-red-400 hover:text-red-500 font-semibold transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Content with expand/collapse for long notes */}
                        <div className="text-stone-500 text-sm leading-relaxed whitespace-pre-wrap">
                            {expandedIds.has(note.id) || note.content.length <= 200
                                ? note.content
                                : `${note.content.slice(0, 200)}...`
                            }
                        </div>
                        {note.content.length > 200 && (
                            <button
                                onClick={() => toggleExpand(note.id)}
                                className="text-xs text-orange-400 hover:text-orange-500 font-semibold self-start transition-colors"
                            >
                                {expandedIds.has(note.id) ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default NotesSection;
