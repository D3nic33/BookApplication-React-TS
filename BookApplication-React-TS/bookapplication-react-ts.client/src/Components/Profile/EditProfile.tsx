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

const EditProfile = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile>({
        id: 0, username: "", email: "", bio: "", readingGoal: null,
    });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

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
            });
    }, []);

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

    const handleChangePassword = async () => {
        setPasswordError("");
        setPasswordSuccess("");
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        const res = await fetch("/api/user/me/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (res.ok) {
            setPasswordSuccess("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            const err = await res.json();
            setPasswordError(err.message ?? "Something went wrong.");
        }
    };

    return (
        <div className="flex flex-col items-center py-8 gap-6">
            <h2 className="text-2xl font-bold">My Profile</h2>

            {/* Profile Info */}
            <div className="flex flex-col w-80 gap-4">
                <h3 className="text-lg font-semibold">Profile Info</h3>

                <div className="flex flex-col gap-1">
                    <label className="capitalize text-sm font-medium">Username</label>
                    <input
                        className="border rounded-lg px-3 py-2 w-full"
                        value={profile.username}
                        onChange={e => setProfile({ ...profile, username: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="capitalize text-sm font-medium">Email</label>
                    <input
                        className="border rounded-lg px-3 py-2 w-full"
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="capitalize text-sm font-medium">Bio</label>
                    <textarea
                        className="border rounded-lg px-3 py-2 w-full resize-none"
                        rows={3}
                        maxLength={500}
                        value={profile.bio}
                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    />
                    <span className="text-xs text-gray-400 text-right">{profile.bio.length}/500</span>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="capitalize text-sm font-medium">Reading Goal (books per year)</label>
                    <input
                        type="number"
                        min={1}
                        className="border rounded-lg px-3 py-2 w-full"
                        placeholder="e.g. 12"
                        value={profile.readingGoal ?? ""}
                        onChange={e => setProfile({ ...profile, readingGoal: e.target.value ? parseInt(e.target.value) : null })}
                    />
                </div>

                {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
                {profileSuccess && <p className="text-green-500 text-sm">{profileSuccess}</p>}

                <button
                    className="py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg"
                    onClick={handleSaveProfile}
                >
                    Save Profile
                </button>
            </div>

            <hr className="w-80 border-gray-200" />

            {/* Change Password */}
            <div className="flex flex-col w-80 gap-4">
                <h3 className="text-lg font-semibold">Change Password</h3>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Current Password</label>
                    <input
                        type="password"
                        className="border rounded-lg px-3 py-2 w-full"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">New Password</label>
                    <input
                        type="password"
                        className="border rounded-lg px-3 py-2 w-full"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        className="border rounded-lg px-3 py-2 w-full"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}

                <button
                    className="py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg"
                    onClick={handleChangePassword}
                >
                    Change Password
                </button>
            </div>
        </div>
    );
};

export default EditProfile;