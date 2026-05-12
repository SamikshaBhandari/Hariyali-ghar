import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Star } from 'lucide-react';

const Plants = () => {
    const [plants, setPlants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const categories = ["All", "Indoor Plants", "Outdoor Plants", "Seeds", "Succulents"];
}
export default Plants;