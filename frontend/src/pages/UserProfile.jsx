import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, LogOut, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const token = localStorage.getItem('token');

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    // lifecycle fetch sync  
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/profile/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const userData = res.data.data;
                    setFullname(userData.fullname || '');
                    setEmail(userData.email || '');
                    setPhoneNumber(userData.mobile || '');
                    setAddress(userData.address || '');
                    setRole(userData.role || 'user');
                }
            } catch (err) {
                console.error("Profile payload mapping error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");

        if (confirmLogout) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert("Logged out successfully!");
            navigate('/login');
        } else {
            console.log("Logout cancelled by user.");
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "This will permanently delete your account, orders, cart, and reviews. This action cannot be undone. Continue?"
        );

        if (!confirmDelete) return;

        try {
            setDeleting(true);

            const res = await axios.delete('http://localhost:5000/api/profile/delete-account', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(res.data.message || "Account deleted successfully.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
        } catch (err) {
            console.error("Delete account error:", err);
            if (err.response) {
                alert(err.response.data?.message || "Could not delete account.");
            } else {
                alert("Network error while deleting account.");
            }
        } finally {
            setDeleting(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const res = await axios.put('http://localhost:5000/api/profile/update', {
                fullname: fullname,
                mobile: phoneNumber,
                address: address
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success) {
                alert("Changes saved successfully!");

                const localUser = JSON.parse(localStorage.getItem('user')) || {};
                const updatedUser = {
                    ...localUser,
                    fullname: fullname,
                    mobile: phoneNumber,
                    address: address
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                alert("Failed: " + (res.data.message || "Unknown error occurred."));
            }
        } catch (err) {
            console.error("Complete Error Context Object:", err);

            //alert logic
            if (err.response) {
                alert(`Error ${err.response.status}: ${err.response.data?.message || "Server rejected data format (Bad Request)"}`);
            } else if (err.request) {
                alert("No response received from Server! Please check if your Backend App is running on port 5000.");
            } else {
                alert("Request Pipeline Error: " + err.message);
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="py-20 text-center font-bold text-green-700 text-xs animate-pulse">Loading template...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/40 pt-24 pb-12 font-sans text-gray-700 flex justify-center items-start">
            <div className="w-full max-w-2xl px-4 space-y-4">

                {/* Top Profile  Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-400 text-white font-bold text-sm flex items-center justify-center shadow-inner select-none">
                            {getInitials(fullname)}
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-gray-800 leading-tight">{fullname}</h2>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                    {role}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">{email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {role !== 'admin' && (
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition disabled:opacity-60"
                            >
                                <Trash2 size={12} /> {deleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 border border-red-100 bg-red-50/30 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                        >
                            <LogOut size={12} /> Logout
                        </button>
                    </div>
                </div>

                {/*Navigation Tabs */}
                <div className="flex gap-3 border-b border-gray-100 pb-2">
                    <button
                        type="button"
                        className="bg-green-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition transform active:scale-95"
                    >
                        <User size={14} /> Profile
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/activity')}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 bg-gray-50/50 text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition transform active:scale-95 border border-gray-200/60"
                    >
                        <FileText size={14} /> My Orders
                    </button>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="border-b border-gray-50 pb-3">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-3 text-gray-400" size={13} />
                                <input
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className="w-full bg-white text-xs border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-green-600 transition shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 text-gray-400" size={13} />
                                <input
                                    type="email"
                                    value={email}
                                    className="w-full bg-gray-50 text-xs text-gray-400 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 cursor-not-allowed outline-none shadow-sm"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</label>
                            <div className="relative flex items-center">
                                <Phone className="absolute left-3 text-gray-400" size={13} />
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Enter phone number"
                                    className="w-full bg-white text-xs border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-green-600 transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Address</label>
                            <div className="relative flex items-center">
                                <MapPin className="absolute left-3 text-gray-400" size={13} />
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address"
                                    className="w-full bg-white text-xs border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-green-600 transition shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* button action*/}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            className="text-[11px] font-bold text-white bg-green-700 hover:bg-green-800 disabled:bg-gray-300 px-5 py-2 rounded-xl transition shadow-md active:scale-95"
                        >
                            {updating ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default UserProfile;