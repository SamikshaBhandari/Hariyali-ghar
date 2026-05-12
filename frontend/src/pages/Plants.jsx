import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Star } from 'lucide-react';

const Plants = () => {
    const [plants, setPlants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const categories = ["All", "Indoor Plants", "Outdoor Plants", "Seed Plants", "Succulents Plants"];

    const fetchFilteredPlants = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/productds/filter`, {
                params: {
                    search: searchQuery,
                    category: activeCategory
                }
            });
            if (response.data.success) {
                setPlants(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching filtered plants:", error);
        }
    }
};

useEffect(() => {
    fetchFilteredPlants();
}, [searchQuery, activeCategory]);


return (
    <>

    </>
)
export default Plants;
