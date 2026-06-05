import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Sprout } from 'lucide-react';
import API from '../api/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const res = await API.post('/auth/forgot-password', { email });
            alert(res.data.message || "OTP code sent to your email!");

            navigate('/reset-password', { state: { email: email } });
        } catch (err) {
            alert(err.response?.data?.error || "Failed to send OTP code.");
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
                <p className="text-green-700 text-sm font-medium">Reset your account password</p>
            </div>

            {/* Forgot Password Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Forgot Password</h2>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Enter your email address below and we will send you a 6-digit OTP verification code to reset your password.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                            Registered Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3 text-slate-500" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="samiksha@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-100 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Send Code Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]`}
                    >
                        {loading ? "Sending Code..." : "Send Verification Code"}
                    </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1 text-xs text-green-600 font-bold hover:underline"
                    >
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;