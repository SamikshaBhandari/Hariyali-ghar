import React from 'react';
import { Sprout, ShoppingCart, Search } from 'lucide-react';

const Navbar = () => {
    return (

        <nav className="fixed w-full z-50 px-8 py-4 flex items-center justify-between bg-transparent">

            <div className="flex items-center gap-2 cursor-pointer">
                <div className="bg-[#10b981] p-1.5 rounded-lg">
                    <Sprout className="text-white" size={26} />
                </div>
                <span className="text-white font-bold text-2xl tracking-tight">
                    Hariyali Ghar
                </span>
            </div>


            <div className="hidden md:flex items-center gap-10 text-white font-medium">
                <a href="/" className="hover:text-green-400 transition">Home</a>
                <a href="/plants" className="hover:text-green-400 transition">Plants</a>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative text-white cursor-pointer hover:text-green-400">
                    <ShoppingCart size={22} />
                    <span className="absolute -top-2 -right-2 bg-green-500 text-[10px] rounded-full px-1.5 py-0.5 text-white">0</span>
                </div>

                <button className="text-white border border-white/40 px-5 py-1.5 rounded-full font-medium hover:bg-white/10">
                    Sign In
                </button>

                <button className="text-white border border-white/40 px-5 py-1.5 rounded-full font-medium hover:bg-white/10">
                    Sign Up
                </button>
            </div>

        </nav>
    );
};

export default Navbar;