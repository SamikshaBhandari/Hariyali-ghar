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
            <div className="bg-green-700 py-10 px-8 text-white text-start">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Hariyali Ghar Collection</h1>
                <p className="text-gray-100 opacity-90">Find the perfect green companion for your space</p>
            </div>


        </div>
    );
};

export default Plants;