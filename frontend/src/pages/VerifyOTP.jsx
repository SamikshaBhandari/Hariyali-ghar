import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api/axiosInstance';
import { ShieldCheck } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email not found. Please signup again.", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        if (loading) return;
        setLoading(true);

        try {
            const res = await API.post('/auth/emailverification', { email, otp });

            toast.success(res.data.message || "Email verified successfully!", {
                position: "top-right",
                autoClose: 1500,
            });

            setTimeout(() => {
                navigate('/login');
            }, 1200);

        } catch (err) {
            toast.error(err.response?.data?.error || "Invalid or Expired OTP", {
                position: "top-right",
                autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
            <ToastContainer />
            <div className="max-w-[380px] py-10 w-full bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="text-center mb-6">
                    <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="text-green-600" size={30} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
                    <p className="text-gray-500 mt-2">Enter the code sent to <br /> <b>{email}</b></p>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="0 0 0 0 0 0"
                        className="w-full text-center text-1xl tracking-[0.3rem] font-bold py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button
                        disabled={loading}
                        className={`w-full py-2 rounded-xl text-white font-semibold shadow-lg transition-all ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 active:scale-95"
                            }`}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;