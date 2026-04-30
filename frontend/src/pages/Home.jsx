import React from 'react';
import { ArrowRight, Home as HomeIcon, Sun, Sprout, Leaf } from 'lucide-react';

import coverImage from '../assets/images/cover.png';


const Home = () => {
    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Hero Section */}
            <div className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${coverImage})` }}
                >
                    <div className="absolute inset-0 bg-black/45"></div>
                </div>

                <div className="relative z-10">
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1 rounded-full text-sm mb-6 inline-block">
                        Nepal's Favourite Plant Store
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Bring Nature <br />
                        <span className="text-green-400">Into Your Home</span>
                    </h1>
                    <div className="flex gap-4 justify-center mt-6">
                        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg text-lg">
                            Shop Plants
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/40 px-8 py-3 rounded-full font-semibold transition text-lg">
                            Browse Seeds
                        </button>
                    </div>
                </div>
            </div>

            {/* Plant Categories Section */}
            <div className="bg-white py-24 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-green-600 font-bold tracking-widest text-xs uppercase">Browse By</span>
                        <h2 className="text-4xl font-serif font-bold text-slate-800 mt-2">Plant Categories</h2>
                        <p className="text-gray-500 mt-2">Find the perfect plant for every space and lifestyle</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;