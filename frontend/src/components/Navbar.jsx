import React, { useState, useEffect } from 'react';
import { Sprout, ShoppingCart, User, LogOut, LayoutDashboard, ShoppingBag, ChevronDown, Settings } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const fetchNavbarCartCount = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/cart/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                setCartCount(res.data.totalItems || 0);
            }
        } catch (err) {
            console.error("Error fetching navbar cart count:", err);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchNavbarCartCount();
        const handleCartUpdate = () => {
            fetchNavbarCartCount();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        window.location.reload();
    };

    const isHomePage = location.pathname === "/";
    const shouldShowBg = isScrolled || !isHomePage;

    return (
        <nav className={`fixed w-full z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${shouldShowBg
            ? "bg-white shadow-md py-3 border-b border-gray-100"
            : "bg-transparent py-5"
            }`}>

            {/* Logo Area */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="bg-[#10b981] p-1.5 rounded-lg">
                    <Sprout className="text-white" size={20} />
                </div>
                <span className={`font-bold text-2xl tracking-tight transition-colors ${shouldShowBg ? "text-[#065f46]" : "text-white"
                    }`}>
                    Hariyali Ghar
                </span>
            </Link>

            {/* Nav Links */}
            <div className={`flex items-center gap-4 md:gap-10 font-medium transition-colors ${shouldShowBg ? "text-gray-700" : "text-white"}`}>
                <Link to="/" className="hover:text-green-500 transition text-sm md:text-base">Home</Link>
                <Link to="/plants" className="hover:text-green-500 transition text-sm md:text-base">Plants</Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6">
                <Link
                    to="/cart"
                    className={`relative cursor-pointer transition-colors ${shouldShowBg ? "text-gray-700" : "text-white"}`}
                >
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-[10px] rounded-full px-1.5 py-0.5 text-white font-bold">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {user ? (
                    /* Profile Dropdown Logic */
                    <div className="relative group">
                        <button className={`flex items-center gap-2 pl-1 pr-2 py-0 rounded-full border transition-all ${shouldShowBg ? "bg-slate-50 border-slate-200" : "bg-white/10 border-white/20"
                            }`}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.fullname}&background=random`}
                                className="w-8 h-8 rounded-full border border-white" alt="profile"
                            />
                            <span className={`text-sm font-bold ${shouldShowBg ? "text-slate-700" : "text-white"}`}>
                                {user.fullname.split(' ')[0]}
                            </span>
                            <ChevronDown size={14} className={shouldShowBg ? "text-slate-400" : "text-white/70"} />
                        </button>

                        {/* Dropdown Menu Layout */}
                        <div className="absolute right-0 mt-2 w-55 bg-white rounded-3xl shadow-3xl border border-slate-50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="px-6 pb-2 border-b border-slate-50 mb-2 text-left">
                                <p className="font-bold text-slate-800 text-sm">{user.fullname}</p>
                                <p className="text-[12px] text-slate-400">{user.email}</p>
                                <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block ${user.role === 'admin' ? "bg-green-100 text-green-700" : "bg-green-100 text-green-700"
                                    }`}>
                                    {user.role === 'admin' ? 'Administrator' : 'User'}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                {user.role === 'admin' ? (
                                    /* Admin Specific Menu */
                                    <>
                                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-6 py-2.5 text-sm hover:bg-green-50 text-slate-600 transition-colors">
                                            <LayoutDashboard size={18} className="text-slate-500" /> My Dashboard
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-2 px-6 py-2.5 text-sm hover:bg-green-50 text-slate-600 transition-colors">
                                            <User size={18} className="text-slate-500" /> My Profile
                                        </Link>
                                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-6 py-2.5 text-sm hover:bg-green-50 text-slate-600 transition-colors">
                                            <div className="p-0.5 border border-slate-300 rounded-md">
                                                <Settings size={14} className="text-slate-500" />
                                            </div>
                                            Admin Panel
                                        </Link>
                                    </>
                                ) : (
                                    /* User Specific Menu */
                                    <>
                                        <Link to="/user/dashboard" className="flex items-center gap-2 px-6 py-2.5 text-sm hover:bg-green-50 text-slate-600 transition-colors">
                                            <LayoutDashboard size={18} className="text-slate-500" /> My Dashboard
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-2 px-6 py-2.5 text-sm hover:bg-green-50 text-slate-600 transition-colors">
                                            <User size={18} className="text-slate-500" /> My Profile
                                        </Link>
                                        <Link to="/myorders" className="flex items-center gap-2 px-6 py-2.5 text-sm hover:bg-green-50 text-slate-600 transition-colors">
                                            <ShoppingBag size={18} className="text-slate-500" /> My Orders
                                        </Link>
                                    </>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-6 py-3 text-sm text-red-500 hover:bg-red-50 mt-2 font-bold border-t border-slate-50 transition-all"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Not Logged In Buttons */
                    <div className="flex items-center gap-3">
                        <Link to="/login" className={`px-5 py-1.5 rounded-full font-medium border transition-all ${shouldShowBg
                            ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "border-white/40 text-white hover:bg-white/10"
                            }`}>
                            Sign In
                        </Link>
                        <Link to="/Register" className="bg-green-600 text-white px-5 py-1.5 rounded-full font-medium hover:bg-green-700 shadow-md shadow-green-200/50 transition-transform active:scale-95">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;