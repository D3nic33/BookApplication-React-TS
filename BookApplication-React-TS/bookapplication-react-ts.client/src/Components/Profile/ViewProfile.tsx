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

interface FollowCounts {
    followers: number;
    following: number;
}

const ViewProfile = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [booksRead, setBooksRead] = useState(0);
    const [followCounts, setFollowCounts] = useState<FollowCounts>({ followers: 0, following: 0 });

    useEffect(() => {
        fetch("/api/user/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.status === 401) { navigate("/login"); return null; }
                return res.json();
            })
            .then(data => {
                if (data) setProfile({ ...data, bio: data.bio ?? "" });
                setLoading(false);
            });

        fetch("/api/user/me/books/read/count", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setBooksRead(data.count));

        fetch("/api/user/me/counts", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setFollowCounts(data));
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <p className="text-stone-400 animate-pulse">Loading your profile... 📖</p>
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

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Page header */}
            <div className="max-w-xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Account
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    My Profile 🌟
                </h1>
            </div>

            {/* Profile Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-8 mb-6">

                {/* Avatar + name */}
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

                {/* Email */}
                <div className="flex flex-col gap-1 mb-5">
                    <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">Email</span>
                    <span className="text-stone-700">{profile.email}</span>
                </div>

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

            {/* Edit button */}
            <div className="max-w-xl mx-auto">
                <button
                    className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-full shadow transition-all"
                    onClick={() => navigate("/profile/edit")}
                >
                    Edit Profile ✏️
                </button>
            </div>

        </div>
    );
};

export default ViewProfile;