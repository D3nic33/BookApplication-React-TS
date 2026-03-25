import { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
interface UserProfile {
    id: number;
    username: string;
    email: string;
    bio: string;
    readingGoal: number | null;
}

const EditProfileInformation = () => {
    const { token } = useAuth();
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profile, setProfile] = useState<UserProfile>({
        id: 0, username: "", email: "", bio: "", readingGoal: null,
    });

    const handleSaveProfile = async () => {
        setProfileError(""); setProfileSuccess("");
        const res = await fetch("/api/user/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                username: profile.username,
                email: profile.email,
                bio: profile.bio,
                readingGoal: profile.readingGoal,
            }),
        });
        if (res.ok) {
            setProfileSuccess("Profile updated successfully!");
        } else {
            const err = await res.json();
            setProfileError(err.message ?? "Something went wrong.");
        }
    };

    const inputClass = "border border-orange-100 bg-amber-50 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition";
    const labelClass = "text-sm font-medium text-stone-600";

    return (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-8 mb-6">
            <h3 className="text-lg font-bold text-stone-800 mb-5">Profile Info</h3>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Username</label>
                    <input
                        className={inputClass}
                        value={profile.username}
                        onChange={e => setProfile({ ...profile, username: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Email</label>
                    <input
                        className={inputClass}
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Bio</label>
                    <textarea
                        className={`${inputClass} resize-none`}
                        rows={3}
                        maxLength={500}
                        value={profile.bio}
                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    />
                    <span className="text-xs text-stone-400 text-right">{profile.bio.length}/500</span>
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Reading Goal <span className="text-stone-400 font-normal">(books per year)</span></label>
                    <input
                        type="number"
                        min={1}
                        className={inputClass}
                        placeholder="e.g. 12"
                        value={profile.readingGoal ?? ""}
                        onChange={e => setProfile({ ...profile, readingGoal: e.target.value ? parseInt(e.target.value) : null })}
                    />
                </div>

                {profileError && (
                    <p className="text-red-400 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                        ⚠️ {profileError}
                    </p>
                )}
                {profileSuccess && (
                    <p className="text-green-600 text-sm bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                        ✅ {profileSuccess}
                    </p>
                )}

                <div className="h-px bg-orange-100 my-1" />

                <button
                    className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-full shadow transition-all"
                    onClick={handleSaveProfile}
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}

export default EditProfileInformation;