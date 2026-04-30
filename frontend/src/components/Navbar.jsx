import React, { useState, useEffect } from 'react';
import { Sprout, ShoppingCart } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled
            ? "bg-white shadow-md py-3"
            : "bg-transparent py-5"
            }`}>

            {/* logo area*/}
            <div className="flex items-center gap-2 cursor-pointer">
                <div className="bg-[#10b981] p-1.5 rounded-lg">
                    <Sprout className="text-white" size={20} />
                </div>
                <span className={`font-bold text-2xl tracking-tight transition-colors ${isScrolled ? "text-[#065f46]" : "text-white"
                    }`}>
                    Hariyali Ghar
                </span>
            </div>

            {/*nav link*/}
            <div className={`hidden md:flex items-center gap-10 font-medium transition-colors ${isScrolled ? "text-gray-700" : "text-white"
                }`}>
                <a href="/" className="hover:text-green-500 transition">Home</a>
                <a href="/plants" className="hover:text-green-500 transition">Plants</a>
            </div>

            {/* action button*/}
            <div className="flex items-center gap-6">
                <div className={`relative cursor-pointer transition-colors ${isScrolled ? "text-gray-700" : "text-white"
                    }`}>
                    <ShoppingCart size={22} />
                    <span className="absolute -top-2 -right-2 bg-green-500 text-[10px] rounded-full px-1.5 py-0.5 text-white">0</span>
                </div>

                <button className={`px-5 py-1.5 rounded-full font-medium border transition-all ${isScrolled
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "border-white/40 text-white hover:bg-white/10"
                    }`}>
                    Sign In
                </button>

                <button className="bg-green-600 text-white px-5 py-1.5 rounded-full font-medium hover:bg-green-700 shadow-md">
                    Sign Up
                </button>
            </div>

        </nav>
    );
};

export default Navbar;