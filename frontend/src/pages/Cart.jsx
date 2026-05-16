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
            window.dispatchEvent(new Event('cartUpdated'));
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
            window.dispatchEvent(new Event('cartUpdated'));
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
                <h2 className="text-xl font-bold text-black mb-2">Your Shopping Cart is Empty</h2>
                <p className="text-gray-500 text-xs mb-6">Add some beautiful plants to brighten up your home!</p>
                <Link to="/" className="inline-block bg-green-700 text-white px-8 py-2 rounded-lg font-bold text-xs hover:bg-[#006633] transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-10 font-sans bg-white min-h-screen">

            <h1 className="text-2xl font-extrabold text-green-700 mb-8">
                Shopping Cart <span className="text-green-600 font-bold text-sm ml-1">({totalItems} items)</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/*Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">

                            {/* Plant Image and Details */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1">
                                    <img
                                        src={`http://localhost:5000/images/${item.image_url}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Plant'; }}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black text-xs sm:text-sm">{item.name}</h3>
                                    <p className="text-green-600 font-extrabold text-xs mt-0.5">NPR {item.price}</p>

                                    {item.stock_quantity <= 5 && (
                                        <span className="text-orange-500 text-[10px] font-bold block mt-0.5">Limited Stock</span>
                                    )}
                                </div>
                            </div>

                            {/* Quantity adjust */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border border-gray-200 rounded-lg h-8 px-2 bg-white">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                        className="p-1 text-gray-400 hover:text-green-700 transition"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="w-6 text-center font-extrabold text-xs text-gray-800">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                        className="p-1 text-gray-400 hover:text-green-700 transition"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>

                                <div className="text-right min-w-[90px]">
                                    <p className="font-black text-green-700 text-xs sm:text-sm">NPR {item.subtotal}</p>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-400 hover:text-red-600 text-[10px] font-bold block ml-auto mt-1 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Order Summary Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-sm">
                    <h2 className="text-sm font-black text-black border-b border-gray-100 pb-3">Order Summary</h2>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between text-gray-500 font-bold">
                            <span>Subtotal ({totalItems} items)</span>
                            <span className="text-gray-800 font-black">NPR {subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 font-bold">
                            <span>Delivery</span>
                            <span className={deliveryFee === 0 ? "text-green-600 font-black" : "text-gray-800 font-black"}>
                                {deliveryFee === 0 ? "Free" : `NPR ${deliveryFee}`}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                        <span className="font-black text-black text-sm">Total</span>
                        <span className="text-lg font-black text-green-700">NPR {total}</span>
                    </div>

                    {/* Free delivery*/}
                    {remainingForFreeDelivery > 0 && (
                        <div className="bg-orange-50 border border-orange-100 text-center py-2 px-3 rounded-xl">
                            <p className="text-[10px] text-orange-700 font-bold">
                                Add NPR {remainingForFreeDelivery} more for free delivery!
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-green-700 hover:bg-green-750 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                    >
                        Proceed to Checkout
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full text-green-600 hover:text-green-800 text-[11px] font-bold block text-center transition"
                    >
                        Continue Shopping
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Cart;