import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Plants = () => {
    const location = useLocation();
    const [plants, setPlants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState(location.state?.filterCategory || "All");
    const categories = ["All", "Indoor Plants", "Outdoor Plants", "Seed Plants", "Succulents Plants"];
    const [expandedId, setExpandedId] = useState(null);


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
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-12">

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

                {/*product section */}
                <div className="flex-1">
                    <div className="mb-6">
                        <p className="text-gray-500 text-sm font-medium">
                            Showing <span className="text-gray-900 font-bold">{plants.length}</span> plants
                        </p>
                    </div>

                    {/* Grid Container */}
                    {plants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {plants.map((plant) => (

                                <div key={plant.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50 flex flex-col group">

                                    <Link to={`/plants/${plant.id}`} className="relative aspect-[4/3] overflow-hidden cursor-pointer block">
                                        <img
                                            src={`http://localhost:5000/images/${plant.image_url}`}
                                            alt={plant.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-1 right-4">
                                            <span className="text-[9px] font-bold text-green-700 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                                {plant.category_name}
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link to={`/plants/${plant.id}`} className="hover:text-green-700 transition-colors">
                                                <h3 className="text-lg font-bold text-gray-800 tracking-tight leading-tight cursor-pointer">
                                                    {plant.name}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                                                <Star
                                                    size={12}
                                                    className={plant.average_rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                                <span className="text-gray-500 text-[11px] font-bold">
                                                    {plant.average_rating > 0 ? Number(plant.average_rating).toFixed(1) : "New"}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-[11px] leading-relaxed">
                                            {plant.description && plant.description.length > 60 ? (
                                                <>
                                                    {expandedId === plant.id ? plant.description : `${plant.description.substring(0, 60)}...`}
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedId(expandedId === plant.id ? null : plant.id)}
                                                        className="text-green-600 font-bold ml-1 hover:underline cursor-pointer"
                                                    >
                                                        {expandedId === plant.id ? "Show Less" : "Read More"}
                                                    </button>
                                                </>
                                            ) : (
                                                plant.description
                                            )}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-sm font-black text-green-700">
                                                NPR {plant.price}
                                            </span>

                                            <Link to={`/plants/${plant.id}`} className="p-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-700 hover:text-white transition-all duration-300 active:scale-90 shadow-sm border border-green-100">
                                                <ShoppingCart size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-medium">No plants available.</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Plants;