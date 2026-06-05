import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Lock, Eye, EyeOff, Sprout } from 'lucide-react';
import API from '../api/api';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const userEmail = location.state?.email || '';

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: userEmail,
        otp: '',
        newPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const res = await API.post('/auth/reset-password', formData);
            alert(res.data.message || "Password updated successfully!");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50/40 pt-24 pb-10 flex flex-col items-center justify-center p-4 font-sans">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-100 mb-3">
                    <Sprout className="text-white" size={22} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hariyali Ghar</h1>
                <p className="text-green-700 text-sm font-medium">Create secure new password</p>
            </div>

            {/* Reset Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Reset Password</h2>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Verify the OTP code sent to your email and set your new login password.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-5">
                    {/* Read-only email context setup */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Email Address</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange} required
                            disabled={!!userEmail}
                            placeholder="Enter your email"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-400 rounded-xl py-2.5 px-4 text-sm outline-none cursor-not-allowed"
                        />
                    </div>

                    {/* OTP Field */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">6-Digit OTP Code</label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-3 text-slate-500" size={18} />
                            <input
                                type="text" name="otp" placeholder="123456" maxLength={6}
                                value={formData.otp} onChange={handleChange} required
                                className="w-full bg-slate-100 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-bold"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-slate-500" size={18} />
                            <input
                                type={showPassword ? "text" : "password"} name="newPassword" placeholder="••••••••"
                                value={formData.newPassword} onChange={handleChange} required
                                className="w-full bg-slate-100 border border-slate-100 rounded-xl py-2.5 pl-9 pr-10 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-slate-400">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]`}
                    >
                        {loading ? "Updating Password..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;