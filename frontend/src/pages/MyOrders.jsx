import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Search, ShoppingCart, Trash2 } from 'lucide-react';

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders/myorders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                setOrders(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [token, navigate]);

    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        try {
            const res = await axios.put(`http://localhost:5000/api/orders/cancel/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.success) {
                alert("Order cancelled successfully!");
                fetchOrders();
            }
        } catch (err) {
            console.error("Cancel Error:", err);
            alert(err.response?.data?.message || "Failed to cancel order.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this order from your history?");
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(`http://localhost:5000/api/orders/delete/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.success) {
                alert("Order removed successfully!");
                fetchOrders();
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert(err.response?.data?.message || "Failed to delete order.");
        }
    };

    if (loading) {
        return (
            <div className="p-20 text-center font-bold text-green-800">
                Loading Purchase Logs...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 font-sans bg-[#f8fafc] min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Side Navigation Sidebar Panel */}
                <div className="w-full lg:w-64 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.fullname || 'User'}&background=random`}
                            className="w-10 h-10 rounded-full object-cover border"
                            alt="Avatar"
                        />
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-sm truncate max-w-[140px]">{user?.fullname || 'User'}</h3>
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 font-bold px-2 py-0.5 rounded-full">
                                Plant Lover
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <button onClick={() => navigate('/user/dashboard')} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left text-slate-500 hover:bg-slate-50">
                            Overview
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left bg-green-50 text-green-700">
                            My Orders
                        </button>
                        <button onClick={() => navigate('/user/dashboard')} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left text-slate-500 hover:bg-slate-50">
                            Activity
                        </button>
                    </div>
                </div>

                {/* Right Main Content Area */}
                <div className="flex-1 w-full space-y-6">
                    <div>
                        <h1 className="text-xl font-black text-slate-800">My Orders</h1>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Manage and track your plant purchases</p>
                    </div>

                    {/* Empty State View when no orders are found */}
                    {orders.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
                                <ShoppingBag size={40} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-slate-700">No orders found.</h3>
                                <p className="text-[11px] text-slate-400 font-medium max-w-sm">
                                    You have not placed any orders yet. Explore Hariyali Ghar to add fresh plants!
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => navigate('/plants')} className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition">
                                    <Search size={14} /> Browse Plants
                                </button>
                                <button onClick={() => navigate('/cart')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition">
                                    <ShoppingCart size={14} /> View Cart
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Live Table Layout View when orders exist */
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                                            <th className="py-4 px-6">Order ID</th>
                                            <th className="py-4 px-6">Address</th>
                                            <th className="py-4 px-6">Total</th>
                                            <th className="py-4 px-6">Method</th>
                                            <th className="py-4 px-6">Payment</th>
                                            <th className="py-4 px-6">Status</th>
                                            <th className="py-4 px-6">Date</th>
                                            <th className="py-4 px-6 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50/40 transition">

                                                {/* Order ID Column */}
                                                <td className="py-4 px-6 text-green-700 font-black">
                                                    ORD-00{order.id}
                                                </td>

                                                {/* Shipping Address Column */}
                                                <td className="py-4 px-6 max-w-[220px]">
                                                    <div className="truncate text-slate-800">{order.address}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                                                        {order.phone_number}
                                                    </div>
                                                </td>

                                                {/* Price Total Amount Column */}
                                                <td className="py-4 px-6 text-slate-900 font-black">
                                                    NPR {Number(order.total_amount).toLocaleString()}
                                                </td>

                                                {/* Payment Method Option Column */}
                                                <td className="py-4 px-6 text-slate-400 font-medium">
                                                    {order.payment_method || 'COD'}
                                                </td>

                                                {/* Payment Status Badge Column */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${order.payment_status === 'Paid'
                                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                        }`}>
                                                        {order.payment_status || 'Pending'}
                                                    </span>
                                                </td>

                                                {/*Order Status Badge Column */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-md ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        (order.status === 'Confirmed' || order.payment_status === 'Paid') ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                            order.status === 'Shipped' ? 'bg-amber-100 text-amber-700' :
                                                                order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                                    'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {order.status === 'Confirmed' || order.payment_status === 'Paid'
                                                            ? 'Confirmed'
                                                            : (order.status && order.status !== '—' ? order.status : 'Pending')}
                                                    </span>
                                                </td>

                                                {/* Order Timestamp Date Column */}
                                                <td className="py-4 px-6 text-slate-400 font-medium">
                                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                                </td>

                                                {/*Dynamic Switch Based on Status */}
                                                <td className="py-4 px-6 text-center">
                                                    {order.status === 'Pending' && order.payment_status !== 'Paid' ? (
                                                        <button
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-[11px] px-3 py-1 rounded-lg transition"
                                                        >
                                                            <Trash2 size={12} /> Cancel
                                                        </button>
                                                    ) :
                                                        (order.status === 'Confirmed' || order.payment_status === 'Paid') && order.status !== 'Delivered' ? (
                                                            <span className="text-[11px] bg-slate-50 text-slate-400 font-semibold px-2.5 py-1 rounded-lg border border-slate-100 cursor-not-allowed inline-block">
                                                                Processing
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleDeleteOrder(order.id)}
                                                                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-rose-600 hover:text-white border border-slate-200 text-slate-600 font-bold text-[11px] px-3 py-1 rounded-lg transition"
                                                            >
                                                                <Trash2 size={12} /> Delete
                                                            </button>
                                                        )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MyOrders;