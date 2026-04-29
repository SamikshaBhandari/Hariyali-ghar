import React from 'react';
import coverImage from '../assets/images/cover.png';
const Home = () => {
    return (
        <div className="relative min-h-screen">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${coverImage})`
                }}
            >
                <div className="absolute inset-0 bg-black/45"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">

                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1 rounded-full text-sm mb-6">
                    Nepal's Favourite Plant Store
                </span>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Bring Nature <br />
                    <span className="text-green-400">Into Your Home</span>
                </h1>

                <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10">
                    Discover hundreds of beautiful plants, seeds, and gardening essentials.
                    Delivered fresh to your doorstep across Nepal.
                </p>

                <div className="flex gap-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg">
                        Shop Plants
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/40 px-8 py-3 rounded-full font-semibold transition">
                        Browse Seeds
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;