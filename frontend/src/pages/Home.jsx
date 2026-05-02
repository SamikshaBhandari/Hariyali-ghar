import React, { useState, useEffect } from 'react';
import { ArrowRight, Home as HomeIcon, Sun, Sprout, Leaf, Star, ChevronRight } from 'lucide-react';
import API from '../api/axiosInstance';

import coverImage from '../assets/images/cover.png';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const IMG_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    API.get('/products/all'),
                    API.get('/categories/all')
                ]);
                if (productRes.data.success) setProducts(productRes.data.data);
                if (categoryRes.data.success) setCategories(categoryRes.data.data);
            } catch (err) {
                console.error("Backend error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    //icon filters 
    const getIcon = (name) => {
        const n = name ? name.toLowerCase() : "";
        if (n.includes('indoor')) return <HomeIcon size={18} />;
        if (n.includes('outdoor')) return <Sun size={18} />;
        if (n.includes('seed')) return <Sprout size={18} />;
        if (n.includes('succulent')) return <Leaf size={18} />;
        return <Leaf size={18} />;
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-white">

            {/* Hero Section */}
            <div className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}>
                    <div className="absolute inset-0 bg-black/45"></div>
                </div>
                <div className="relative z-10 text-white">
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-sm mb-6 inline-flex items-center gap-2">
                        <Leaf size={14} className="text-green-400" /> Nepal's Favourite Plant Store
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                        Bring Nature <br /> <span className="text-green-400">Into Your Home</span>
                    </h1>
                    <p className="text-lg md:text-md text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Discover hundreds of beautiful plants, seeds, and gardening essentials.
                        Delivered fresh to your doorstep across Nepal.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-green-600 hover:bg-green-700 px-10 py-3.5 rounded-full font-bold shadow-lg transition-all min-w-[180px]">
                            Shop Plants
                        </button>
                        <button className="bg-white/10 backdrop-blur-md border border-white/40 hover:bg-white/20 px-10 py-3.5 rounded-full font-bold transition-all min-w-[180px]">
                            Browse Seeds
                        </button>
                    </div>
                </div>
            </div>

            {/* Plant Categories Section */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-12">
                        <span className="text-green-600 font-bold tracking-widest text-xs uppercase">Browse By</span>
                        <h2 className="text-4xl font-serif font-bold text-slate-800 mt-2">Plant Categories</h2>
                        <p className="text-gray-500 mt-2">Find the perfect plant for every space and lifestyle</p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, index) => {
                            const imagePath = `${IMG_URL}/images/${cat.category_image}`;

                            return (
                                <div
                                    key={index}
                                    className="relative group overflow-hidden rounded-[1.5rem] h-[300px] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                                >
                                    <img
                                        src={imagePath}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={cat.category_name}
                                        onError={(e) => {
                                            console.error("Link mistake:", imagePath);
                                        }}
                                    />

                                    {/*Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                                    {/*Top Right Arrow*/}
                                    <div className="absolute top-5 right-5 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <ArrowRight size={14} className="text-green-600" />
                                    </div>

                                    {/*Content Area: Icon, Name, and Description */}
                                    <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                                        {/* Green Icon Box */}
                                        <div className="bg-[#22c55e] w-7 h-7 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                                            <div className="text-white text-lg">
                                                {getIcon(cat.category_name)}
                                            </div>
                                        </div>

                                        {/* Category Name*/}
                                        <h3 className="text-2xl font-bold tracking-tight mb-1">
                                            {cat.category_name}
                                        </h3>

                                        {/*Category Description */}
                                        <p className="text-gray-200 text-xs font-medium leading-relaxed opacity-90 line-clamp-2">
                                            {cat.description || ""}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>


            {/* Featured Plants Section */}
            <div className="bg-[#f9fbf9] py-16 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header Part */}
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-green-600 font-bold tracking-widest text-xs uppercase">Handpicked</span>
                            <h2 className="text-3xl font-serif font-bold text-slate-800 mt-2">Featured Plants</h2>
                        </div>
                        <button className="flex items-center gap-1 text-green-700 font-bold hover:underline transition-all">
                            View All <ArrowRight size={14} />
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Home;