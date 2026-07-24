import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sprout } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [role, setRole] = useState('user');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const res = await api.post('/auth/login', {
                ...formData,
                role: role
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            toast.success("Login Successful!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });

            setTimeout(() => {
                if (res.data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
                window.location.reload();
            }, 1200);

        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed.", {
                position: "top-right",
                autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50/40 pt-24 pb-10 flex flex-col items-center justify-center p-4 font-sans">
            <ToastContainer />
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-100 mb-3">
                    <Sprout className="text-white" size={22} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hariyali Ghar</h1>
                <p className="text-green-700 text-sm font-medium">Sign in to your account</p>
            </div>

            {/* Login Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome Back</h2>

                <div className="flex bg-slate-100 p-1 rounded-xl mb-8 mt-4">
                    <button
                        onClick={() => setRole('admin')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-green-700 text-white shadow-md' : 'text-slate-700 hover:text-slate-700'}`}
                    >
                        Admin Login
                    </button>
                    <button
                        onClick={() => setRole('user')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'user' ? 'bg-green-700 text-white shadow-sm' : 'text-slate-700 hover:text-slate-700'}`}
                    >
                        User Login
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                            {role === 'admin' ? 'Admin Email' : 'User Email Address'}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3 text-slate-500" size={18} />
                            <input
                                type="email" name="email" placeholder="samiksha@gmail.com"
                                value={formData.email} onChange={handleChange} required
                                className="w-full bg-slate-100 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-slate-300" size={18} />
                            <input
                                type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                                value={formData.password} onChange={handleChange} required
                                className="w-full bg-slate-100 border border-slate-100 rounded-xl py-2.5 pl-9 pr-10 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-slate-400">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/*forgot password*/}
                        <div className="flex justify-end mt-2 mr-1">
                            <Link
                                to="/forgot-password"
                                className="text-[11px] font-bold text-green-600 hover:text-green-700 hover:underline transition-all"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>


                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]`}
                    >
                        {loading ? "Verifying..." : <><LogIn size={18} /> Sign In as {role.toLowerCase()}</>}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-8">
                    Don't have an account? <Link to="/register" className="text-green-600 font-bold hover:underline ml-1">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;