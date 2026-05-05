import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, UserPlus, Sprout } from 'lucide-react';
import api from '../api/api';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        mobile: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match!");
        }

        try {
            const res = await api.post('/users/signup', {
                fullname: formData.fullname,
                email: formData.email,
                mobile: formData.mobile,
                address: formData.address,
                password: formData.password
            });

            alert(res.data.message);

            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            alert(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50/40 flex flex-col items-center pt-24 pb-10 px-4 font-sans">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-100 mb-3 transition-transform hover:scale-105">
                    <Sprout className="text-white" size={22} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hariyali Ghar</h1>
                <p className="text-green-700 text-sm mt-1 font-medium">Join our green garden</p>
            </div>

            {/* Form Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                    Join Hariyali Ghar
                </h2>

                <form onSubmit={handleSignup} className="space-y-3">

                    {/* Full Name */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-2.5 text-slate-300" size={16} />
                            <input
                                type="text" name="fullname" placeholder="Samiksha bhandari"
                                value={formData.fullname} onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 ml-1">Email Address </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-2.5 text-slate-300" size={16} />
                            <input
                                type="email" name="email" placeholder="samiksha@gmail.com"
                                value={formData.email} onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Phone and Address box*/}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 ml-1">Phone </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-2.5 text-slate-300" size={16} />
                                <input
                                    type="text" name="mobile" placeholder="9842306754"
                                    value={formData.mobile} onChange={handleChange} required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 ml-1">Address </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-2.5 text-slate-300" size={16} />
                                <input
                                    type="text" name="address" placeholder="Itahari"
                                    value={formData.address} onChange={handleChange} required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 ml-1">Password </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-2.5 text-slate-300" size={16} />
                            <input
                                type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                                value={formData.password} onChange={handleChange} required
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-11 pr-9 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-2.5 text-slate-400 hover:text-green-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 ml-1">Confirm Password </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-2.5 text-slate-300" size={16} />
                            <input
                                type="password" name="confirmPassword" placeholder="••••••••"
                                value={formData.confirmPassword} onChange={handleChange} required
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Create Account*/}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                    >
                        <UserPlus size={18} /> Create Account
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Already have an account? <Link to="" className="text-green-600 font-bold hover:underline ml-1">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;