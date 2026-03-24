import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    bio: string;
    readingGoal: number | null;
}

const ViewProfile = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [booksRead, setBooksRead] = useState(0);

    useEffect(() => {
        fetch("/api/user/me", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (res.status === 401) {
                    navigate("/login"); return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setProfile({ ...data, bio: data.bio ?? "" });
                }
                setLoading(false);
            });

        fetch("/api/user/me/books/read/count", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setBooksRead(data.count));
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;
    if (!profile) return <p className="text-center mt-10 text-red-400">Could not load profile.</p>;

    const goalProgress = profile.readingGoal
        ? Math.min((booksRead / profile.readingGoal) * 100, 100)
        : 0;

    return (
        <div className="flex flex-col items-center py-8 gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-orange-400 flex items-center justify-center text-white text-4xl font-bold">
                {profile.username.charAt(0).toUpperCase()}
            </div>

            {/* Username */}
            <h2 className="text-2xl font-bold">{profile.username}</h2>

            {/* Bio */}
            <div className="w-80 bg-gray-50 rounded-lg p-4 text-center text-gray-600 text-sm">
                {profile.bio ? profile.bio : <span className="italic text-gray-400">No bio yet.</span>}
            </div>

            {/* Info Card */}
            <div className="w-80 flex flex-col gap-3">
                <div className="flex flex-col gap-1 border rounded-lg px-4 py-3">
                    <span className="text-xs text-gray-400 uppercase font-semibold">Email</span>
                    <span className="text-gray-700">{profile.email}</span>
                </div>
            </div>

            {/* Reading Goal */}
            {profile.readingGoal && (
                <div className="w-80 flex flex-col gap-2 border rounded-lg px-4 py-3">
                    <div className="flex justify-between text-sm font-medium">
                        <span>📚 Reading Goal</span>
                        <span className="text-orange-400">{profile.readingGoal} books this year</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-orange-400 h-3 rounded-full transition-all"
                            style={{ width: `${goalProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 text-right">
                        {booksRead} / {profile.readingGoal} books read
                    </p>
                </div>
            )}

            {/* Edit Button */}
            <button
                className="py-3 bg-orange-400 hover:bg-orange-500 text-white w-80 rounded-lg"
                onClick={() => navigate("/profile/edit")}
            >
                Edit Profile
            </button>
        </div>
    );
};

export default ViewProfile;