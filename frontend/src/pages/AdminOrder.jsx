import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Leaf,
    ShoppingBag,
    PlusCircle,
    Clock,
    CheckCircle2,
    Eye,
    X
} from 'lucide-react';

const API = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

const AdminOrder = () => {
    const token = localStorage.getItem('token');
    const [adminUser, setAdminUser] = useState({ fullname: 'Admin' });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

    // Dropdown updates loading handles
    const [updatingId, setUpdatingId] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalItems, setModalItems] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setAdminUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/orders/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.success) {
                const fetchedOrders = res.data.data || [];
                setOrders(fetchedOrders);

                // Live Counters Calculation Based on status field
                const pending = fetchedOrders.filter(o => o.status?.toLowerCase() === 'pending').length;
                const completed = fetchedOrders.filter(o => o.status?.toLowerCase() === 'delivered').length;
                setStats({ total: fetchedOrders.length, pending, completed });
            }
        } catch (err) {
            console.error("Error fetching orders from MySQL database:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, currentOrder, newStatus) => {
        if (currentOrder.status === 'Cancelled') {
            alert("This order has been cancelled by the user and cannot be changed.");
            return;
        }
        try {
            setUpdatingId(orderId);
            await axios.put(`${API}/orders/update/${orderId}`,
                {
                    status: newStatus,
                    payment_status: currentOrder.payment_status || 'unpaid'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Order status updated to ${newStatus}!`);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    // View Plants Breakdown inside that target order
    const viewOrderDetails = async (order) => {
        setSelectedOrder(order);
        setModalItems([]);
        try {
            setModalLoading(true);
            const res = await axios.get(`${API}/orders/details/${order.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                setModalItems(res.data.items || []);
            }
        } catch (err) {
            console.error("Error fetching items payload:", err);
            setModalItems([]);
        } finally {
            setModalLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'shipped': return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'delivered': return 'bg-green-50 border-green-200 text-green-700';
            case 'cancelled': return 'bg-red-50 border-red-200 text-red-700';
            default: return 'bg-slate-50 border-slate-200 text-slate-600';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 mt-16 font-sans bg-[#f8fafc] min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 sticky top-24">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                {adminUser.fullname ? adminUser.fullname[0].toUpperCase() : 'A'}
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">{adminUser.fullname}</h3>
                                <span className="inline-block text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-md mt-1">Admin</span>
                            </div>
                        </div>
                        <hr className="border-slate-100" />
                        <nav className="flex flex-col space-y-1">
                            <Link to="/admin/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 text-left transition">
                                <LayoutDashboard size={16} /> Overview
                            </Link>
                            <Link to="/admin/manage-plants" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 text-left transition">
                                <Leaf size={16} /> Manage Plants
                            </Link>
                            <Link to="/admin/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black bg-green-50 text-green-700 text-left">
                                <ShoppingBag size={16} /> Orders
                            </Link>
                            <Link to="/admin/add-plant" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 text-left transition">
                                <PlusCircle size={16} /> Add Plant
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Purchase Orders</h1>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Monitor transactions, adjust dispatch schedules, and coordinate delivery states</p>
                    </div>

                    {/* Stats Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 text-slate-700"><ShoppingBag size={20} /></div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Incoming</p>
                                <p className="text-lg font-black text-slate-800">{stats.total} Orders</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><Clock size={20} /></div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Process</p>
                                <p className="text-lg font-black text-slate-800">{stats.pending} Pending</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-50 text-green-600"><CheckCircle2 size={20} /></div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dispatched Goods</p>
                                <p className="text-lg font-black text-slate-800">{stats.completed} Delivered</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders Table Layout */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse">Loading order records database...</div>
                        ) : orders.length === 0 ? (
                            <div className="p-12 text-center text-xs font-bold text-slate-400">No client purchase entries captured yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                                            <th className="p-4">Order ID</th>
                                            <th className="p-4">Customer Details</th>
                                            <th className="p-4">Total Amount</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Current Status</th>
                                            <th className="p-4 text-right">Operational Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition">
                                                <td className="p-4 font-bold text-slate-900">
                                                    #{order.id}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800">{order.fullname || 'Hariyali Client'}</div>
                                                    <div className="text-[10px] text-slate-400 font-semibold">{order.phone_number || 'No Contact'}</div>
                                                    <div className="text-[9px] text-slate-400 max-w-[150px] truncate">{order.address}</div>
                                                </td>
                                                <td className="p-4 font-bold text-green-700">
                                                    Rs. {order.total_amount}
                                                </td>
                                                <td className="p-4 text-slate-400 text-[11px] font-semibold">
                                                    {order.created_at ? (
                                                        <>
                                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                            <br />
                                                            <span className="text-[9px] font-bold text-slate-500">
                                                                {new Date(order.created_at).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })}
                                                            </span>
                                                        </>
                                                    ) : 'Recent'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                                                        {order.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">

                                                        <select
                                                            disabled={updatingId === order.id || order.status?.toLowerCase() === 'cancelled'}
                                                            value={order.status || 'Pending'}
                                                            onChange={(e) => handleUpdateStatus(order.id, order, e.target.value)}
                                                            className={`border border-slate-200 rounded-lg p-1 text-[11px] font-bold bg-white focus:outline-none cursor-pointer 
                                                                ${order.status?.toLowerCase() === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Plant Items*/}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">

                            <button
                                onClick={() => { setSelectedOrder(null); setModalItems([]); }}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <hr className="border-slate-100" />

                        {/* Sub-items List rendering logic*/}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {modalLoading ? (
                                <div className="text-center py-6 text-xs text-slate-400 font-semibold animate-pulse">Fetching plant metrics pool...</div>
                            ) : modalItems.length > 0 ? (
                                modalItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                        <div className="flex items-center gap-3">
                                            {item.image_url && (
                                                <img src={item.image_url} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-800">{item.name || 'Plant Item'}</p>
                                                <p className="text-[10px] text-slate-400 font-semibold">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-extrabold text-slate-700">Rs. {item.price_at_purchase || item.price}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-400 text-[11px] font-bold space-y-1">
                                    <p>Method: {selectedOrder.payment_method || 'COD'}</p>
                                    <p className="text-[10px] font-medium text-slate-400">Address: {selectedOrder.address}</p>
                                </div>
                            )}
                        </div>

                        <hr className="border-slate-100" />
                        <div className="flex justify-between items-center bg-green-50/50 border border-green-100/50 p-3 rounded-xl text-xs">
                            <span className="font-bold text-green-800">Total Bill Amount:</span>
                            <span className="font-black text-green-700 text-sm">
                                Rs. {selectedOrder.total_amount}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrder;