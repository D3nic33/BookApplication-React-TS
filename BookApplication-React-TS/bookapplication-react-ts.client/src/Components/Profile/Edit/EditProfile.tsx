import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import EditProfilePassword from "./EditProfilePassword";
import EditProfileInformation from "./EditProfileInformation";

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

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Page header */}
            <div className="max-w-xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Account
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    Edit Profile ✏️
                </h1>
                <p className="text-stone-400 mt-2 text-sm">Update your personal info and password below.</p>
            </div>

            {/* Profile Info Card */}
            <EditProfileInformation profile={profile} setProfile={setProfile} />

            {/* Change Password Card */}
            <EditProfilePassword />

        </div>
    );
};

export default EditProfile;