import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Star, Calendar, Package, ArrowLeft, MapPin, Phone, CreditCard, XCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserActivity = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    //Order Cancel garne handler function pipeline
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            const res = await axios.put(`http://localhost:5000/api/orders/cancel/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                alert("Order cancelled successfully!");
                // State local reload sync array optimization
                setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Cancelled' } : order));
            } else {
                alert(res.data.message || "Failed to cancel order.");
            }
        } catch (err) {
            console.error("Error cancelling order:", err);
            alert("Something went wrong while cancelling the order.");
        }
    };

    const fetchActivityData = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const [ordersRes, reviewsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/activity/orders', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/activity/reviews', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (ordersRes.data.success) setOrders(ordersRes.data.data || []);
            if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews || []);
        } catch (err) {
            console.error("Error fetching activity logs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityData();
    }, [token]);

    if (!token) {
        return (
            <div className="p-20 text-center text-sm font-medium text-gray-500">
                Please <Link to="/login" className="text-green-700 underline font-bold">Login</Link> to view your activity dashboard.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-10 font-sans bg-white">
            {/* Header section */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">My Activity Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-1">Track your green purchases and feedback history</p>
                </div>
                <Link to="/" className="inline-flex items-center text-xs text-green-700 font-bold gap-1 hover:underline">
                    <ArrowLeft size={14} /> Home
                </Link>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b border-gray-100 mb-6">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-3 text-xs font-bold relative flex items-center gap-2 transition-all ${activeTab === 'orders' ? 'text-green-700' : 'text-gray-400'}`}
                >
                    <ShoppingBag size={14} /> My Orders ({orders.length})
                    {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-green-700 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 text-xs font-bold relative flex items-center gap-2 transition-all ${activeTab === 'reviews' ? 'text-green-700' : 'text-gray-400'}`}
                >
                    <Star size={14} /> My Reviews ({reviews.length})
                    {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-green-700 rounded-full" />}
                </button>
            </div>

            {/* Content Display Panel */}
            {loading ? (
                <div className="py-10 text-center font-bold text-green-700 text-xs animate-pulse">Loading activity metrics...</div>
            ) : (
                <div className="space-y-4">
                    {/* Orders Tab View */}
                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {orders.length > 0 ? orders.map((order) => (
                                <div key={order.id} className="border border-gray-100 p-5 rounded-2xl bg-gray-50/50 flex flex-col gap-4">

                                    <div className="flex flex-col md:flex-row justify-between gap-4 pb-3 border-b border-gray-200/50">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Package size={16} className="text-green-600" />
                                                <span className="text-sm font-extrabold text-gray-800">Order #{order.id}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                                <Calendar size={12} />
                                                <span>Ordered on: {new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] text-gray-600 mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-gray-400" />
                                                    <span>{order.address || 'No Address'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Phone size={12} className="text-gray-400" />
                                                    <span>{order.phone_number || 'No Phone'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 col-span-1 md:col-span-2">
                                                    <CreditCard size={12} className="text-gray-400" />
                                                    <span className="capitalize">{order.payment_method || 'COD'} ({order.payment_status || 'Pending'})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex md:flex-col justify-between md:justify-start items-center md:items-end gap-2">
                                            <p className="text-sm font-extrabold text-green-700">NPR {order.total_amount}</p>
                                            <span className={`inline-block text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${order.status === 'Completed' || order.status === 'Delivered'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'Cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>

                                    {/*Purchased Order Items mapping wrapper section */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Items Ordered</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            {item.product_image && (
                                                                <img
                                                                    src={`http://localhost:5000/images/${item.product_image}`}
                                                                    alt={item.product_name}
                                                                    className="w-10 h-10 object-cover rounded-lg border border-gray-100 bg-slate-50"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-800">{item.product_name}</p>
                                                                <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs font-extrabold text-gray-700">NPR {item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Panel */}
                                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100/70">
                                        {order.status === 'Pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-[10px] font-bold hover:bg-rose-100 transition duration-150"
                                            >
                                                <XCircle size={12} /> Cancel Order
                                            </button>
                                        )}
                                        {(order.status === 'Delivered' || order.status === 'Completed') && (
                                            <Link
                                                to={`/plants`}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-[10px] font-bold hover:bg-green-100 transition duration-150"
                                            >
                                                <PlusCircle size={12} /> Write a Review
                                            </Link>
                                        )}
                                    </div>

                                </div>
                            )) : (
                                <p className="text-gray-400 text-xs italic py-4">You haven't placed any orders yet. Start shopping! 🌱</p>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab View */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-3">
                            {reviews.length > 0 ? reviews.map((review) => (
                                <div key={review.id} className="border border-gray-100 p-4 rounded-xl bg-white shadow-sm flex gap-4 items-start">
                                    <img
                                        src={`http://localhost:5000/images/${review.image_url}`}
                                        alt={review.product_name}
                                        className="w-12 h-12 object-cover rounded-lg bg-gray-50 border border-gray-100"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-extrabold text-gray-800">{review.product_name}</h4>
                                            <div className="flex text-yellow-400">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} size={10} fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-[11px] italic font-medium">"{review.comment}"</p>
                                        <p className="text-[9px] text-gray-400 pt-1">Reviewed on: {new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-400 text-xs italic py-4">You haven't shared any product feedback yet.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserActivity;