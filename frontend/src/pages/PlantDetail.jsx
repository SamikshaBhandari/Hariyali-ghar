import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Sun, Droplets, Heart, Star, ShoppingCart, Minus, Plus, ChevronLeft } from 'lucide-react';

const PlantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plant, setPlant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');
    const [reviews, setReviews] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const isUser = user && user.role === 'user';

    useEffect(() => {
        const fetchPlantData = async () => {
            try {
                const plantRes = await axios.get(`http://localhost:5000/api/products/${id}`);
                setPlant(plantRes.data.data);

                const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
                setReviews(reviewRes.data.data || []);
            } catch (err) {
                console.error("Error loading plant data", err);
            }
        };
        fetchPlantData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = async () => {
        if (!isUser) {
            alert("Please login as a user to add items to cart!");
            return navigate('/login');
        }
        try {
            await axios.post('http://localhost:5000/api/cart/add',
                { product_id: plant.id, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Plant added to cart!");
        } catch (err) {
            alert("Failed to add to cart.");
        }
    };

    if (!plant) return <div className="p-20 text-center font-bold text-green-800">Hariyali Loading...</div>;


};

export default PlantDetail;