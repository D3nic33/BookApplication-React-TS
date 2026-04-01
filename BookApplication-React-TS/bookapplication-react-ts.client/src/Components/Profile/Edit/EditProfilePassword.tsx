import { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";

const EditProfilePassword = () => {
    const { token } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

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

    const inputClass = "border border-orange-100 bg-amber-50 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition";
    const labelClass = "text-sm font-medium text-stone-600";

    return (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-5 sm:p-8">
            <h3 className="text-lg font-bold text-stone-800 mb-5">Change Password 🔒</h3>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Current Password</label>
                    <input
                        type="password"
                        className={inputClass}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>New Password</label>
                    <input
                        type="password"
                        className={inputClass}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Confirm New Password</label>
                    <input
                        type="password"
                        className={inputClass}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                {passwordError && (
                    <p className="text-red-400 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                        ⚠️ {passwordError}
                    </p>
                )}
                {passwordSuccess && (
                    <p className="text-green-600 text-sm bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                        ✅ {passwordSuccess}
                    </p>
                )}

                <div className="h-px bg-orange-100 my-1" />

                <button
                    className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-full shadow transition-all"
                    onClick={handleChangePassword}
                >
                    Change Password
                </button>
            </div>
        </div>
    )
}

export default EditProfilePassword;