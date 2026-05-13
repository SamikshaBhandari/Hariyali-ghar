import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Star } from 'lucide-react';

const Plants = () => {
    const [plants, setPlants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const categories = ["All", "Indoor Plants", "Outdoor Plants", "Seed Plant", "Succulents Plant"];

    const fetchFilteredPlants = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products/filter`, {
                params: {
                    search: searchQuery,
                    category: activeCategory
                }
            });
            if (response.data.success) {
                setPlants(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching filtered plants:", err);
        }
    };

    useEffect(() => {
        fetchFilteredPlants();
    }, [searchQuery, activeCategory]);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">

            {/* header section */}
            <div className="bg-green-700 py-12 px-14 text-white text-start">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Hariyali Ghar Collection</h1>
                <p className="text-gray-100 opacity-90">Find the perfect green companion for your space</p>
            </div>

            {/*main container */}
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">

                {/*sidebar container */}
                <div className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-sm h-fit border border-gray-100">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-6">Filters</h2>

                    {/*Search container */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-500 block mb-2 ">Search Plants</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="eg: money plant"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category container */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-4">Category</label>
                        <div className="flex flex-col gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === cat
                                        ? "bg-green-800 text-white shadow-lg"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-green-600"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>



            </div>

        </div>
    );
};

export default Plants;