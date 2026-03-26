import { useEffect, useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import StarRatingShow from '../../Rating/StarRatingShow';
import StarRatingPicker from '../../Rating/StarRatingPicker';

interface Review {
    id: number;
    bookId: number;
    userId: number;
    username: string;
    stars: number;
    reviewText: string;
    createdAt: string;
    updatedAt?: string;
}

interface ReviewSectionProps {
    bookId: number;
    isReadShelf: boolean;
    onReviewChange: () => void
}

const ReviewSection = ({ bookId, isReadShelf, onReviewChange }: ReviewSectionProps) => {
    const { token } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [myReview, setMyReview] = useState<Review | null>(null);
    const [stars, setStars] = useState(0);
    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const fetchReviews = async () => {
        const res = await fetch(`/api/reviews/book/${bookId}`, { headers });
        if (res.ok) setReviews(await res.json());
    };

    const fetchMyReview = async () => {
        const res = await fetch(`/api/reviews/book/${bookId}/mine`, { headers });
        if (res.ok) {
            const data = await res.json();
            setMyReview(data);
            setStars(data.stars);
            setText(data.reviewText);
        }
    };

    useEffect(() => {
        Promise.all([fetchReviews(), fetchMyReview()]).finally(() => setLoading(false));
    }, [bookId]);

    const handleSubmit = async () => {
        if (stars === 0) { setError('Please select a star rating.'); return; }
        setSubmitting(true);
        setError('');
        const res = await fetch(`/api/reviews/book/${bookId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ rating: stars, reviewText: text }),
        });
        if (res.ok) {
            await Promise.all([fetchReviews(), fetchMyReview()]);
            onReviewChange();
        } else {
            const data = await res.json();
            setError(data.message ?? 'Failed to submit review.');
        }
        setSubmitting(false);
    };

    const handleUpdate = async () => {
        if (!myReview) return;
        if (stars === 0) { setError('Please select a star rating.'); return; }
        setSubmitting(true);
        setError('');
        const res = await fetch(`/api/reviews/${myReview.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ rating: stars, reviewText: text }),
        });
        if (res.ok) {
            setIsEditing(false);
            await Promise.all([fetchReviews(), fetchMyReview()]);
            onReviewChange();
        } else {
            const data = await res.json();
            setError(data.message ?? 'Failed to update review.');
        }
        setSubmitting(false);
    };

    const handleDelete = async () => {
        if (!myReview) return;
        const res = await fetch(`/api/reviews/${myReview.id}`, { method: 'DELETE', headers });
        if (res.ok) {
            setMyReview(null);
            setStars(0);
            setText('');
            await fetchReviews();
            onReviewChange();
        }
    };

    if (loading) return <p className="text-stone-400 text-sm animate-pulse py-2">Loading reviews...</p>;

    return (
        <div className="flex flex-col gap-6">

            {/* ── Write / Edit review ── */}
            {isReadShelf && (
                <div className="flex flex-col gap-3">
                    <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">
                        {myReview && !isEditing ? 'Your Review' : myReview ? 'Edit Your Review' : 'Write a Review'}
                    </span>

                    {/* View mode */}
                    {myReview && !isEditing ? (
                        <div className="bg-amber-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-2">
                            <StarRatingShow rating={myReview.stars} />
                            {myReview.reviewText
                                ? <p className="text-stone-600 text-sm leading-relaxed">{myReview.reviewText}</p>
                                : <p className="italic text-stone-300 text-sm">No written review.</p>
                            }
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-orange-400 hover:text-orange-500 font-semibold transition-colors"
                                >
                                    Edit
                                </button>
                                <span className="text-stone-200">|</span>
                                <button
                                    onClick={handleDelete}
                                    className="text-xs text-red-400 hover:text-red-500 font-semibold transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Write / edit form */
                        <div className="bg-amber-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-3">
                            <StarRatingPicker value={stars} onChange={setStars} />
                            <textarea
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="Share your thoughts about this book..."
                                maxLength={2000}
                                rows={4}
                                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                            />
                            {error && <p className="text-red-400 text-xs">{error}</p>}
                            <div className="flex gap-2">
                                <button
                                    onClick={myReview ? handleUpdate : handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-full text-sm transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : myReview ? 'Save Changes' : 'Post Review'}
                                </button>
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setStars(myReview!.stars);
                                            setText(myReview!.reviewText);
                                        }}
                                        className="flex-1 bg-white border-2 border-orange-200 text-orange-400 font-semibold py-2 rounded-full text-sm transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── All reviews ── */}
            <div className="flex flex-col gap-3">
                <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">
                    All Reviews {reviews.length > 0 && `(${reviews.length})`}
                </span>

                {reviews.length === 0 ? (
                    <p className="text-stone-300 text-sm italic">No reviews yet.</p>
                ) : (
                    reviews.map(r => (
                        <div key={r.id} className="bg-white border border-orange-100 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-stone-700">{r.username}</span>
                                <span className="text-xs text-stone-300">
                                    {new Date(r.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                    {r.updatedAt && ' (edited)'}
                                </span>
                            </div>
                            <StarRatingShow rating={r.stars} />
                            {r.reviewText && (
                                <p className="text-stone-500 text-sm leading-relaxed mt-1">{r.reviewText}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;