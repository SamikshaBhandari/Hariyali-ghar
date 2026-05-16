import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Minus, Plus } from 'lucide-react';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    //Fetch real-time cart data 
    const fetchCartData = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get('http://localhost:5000/api/cart/all', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Cart API Response:", res.data);

            if (res.data && res.data.success) {
                setCartItems(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching cart data:", err);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const handleUpdateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`http://localhost:5000/api/cart/update`,
                { id: cartId, quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCartData();
        } catch (err) {
            console.error("Error updating quantity:", err);
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            }
        }
    };

    // Remove an item from the cart
    const handleRemoveItem = async (cartId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/remove/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCartData();
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };

    //cart item and removing section
    const totalItems = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const subtotal = cartItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);

    // Free delivery if subtotal is NPR 1500 or above, otherwise charge NPR 100
    const deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : 100;
    const total = subtotal + deliveryFee;
    const remainingForFreeDelivery = 1500 - subtotal;

    if (loading) return <div className="p-20 text-center font-bold text-green-800">Loading Your Cart...</div>;

    if (!token || cartItems.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center font-sans">
                <h2 className="text-xl font-bold text-[#1C2E24] mb-2">Your Shopping Cart is Empty</h2>
                <p className="text-gray-500 text-xs mb-6">Add some beautiful plants to brighten up your home!</p>
                <Link to="/" className="inline-block bg-[#008744] text-white px-8 py-2 rounded-lg font-bold text-xs hover:bg-[#006633] transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }


};

export default Cart;