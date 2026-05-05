import React, { useState, useEffect } from 'react';
import { Sprout, ShoppingCart } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <div className={`hidden md:flex items-center gap-10 font-medium transition-colors ${shouldShowBg ? "text-gray-700" : "text-white"
                }`}>
                <Link to="/" className="hover:text-green-500 transition">Home</Link>
                <Link to="/plants" className="hover:text-green-500 transition">Plants</Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6">
                <div className={`relative cursor-pointer transition-colors ${shouldShowBg ? "text-gray-700" : "text-white"
                    }`}>
                    <ShoppingCart size={22} />
                    <span className="absolute -top-2 -right-2 bg-green-500 text-[10px] rounded-full px-1.5 py-0.5 text-white">0</span>
                </div>

                <Link to="/login" className={`px-5 py-1.5 rounded-full font-medium border transition-all ${shouldShowBg
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "border-white/40 text-white hover:bg-white/10"
                    }`}>
                    Sign In
                </Link>

                <Link to="/Register" className="bg-green-600 text-white px-5 py-1.5 rounded-full font-medium hover:bg-green-700 shadow-md transition-transform active:scale-95">
                    Sign Up
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;