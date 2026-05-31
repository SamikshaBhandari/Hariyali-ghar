import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    LayoutDashboard,
    Leaf,
    ShoppingBag,
    Users,
    AlertTriangle,
    DollarSign,
    PlusCircle
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [stockAlerts, setStockAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [adminUser, setAdminUser] = useState({ fullname: 'Admin', email: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setAdminUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("User parsing error", e);
            }
        }

        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                // Backend endpoint hit
                const res = await axios.get('http://localhost:5000/api/orders/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data && res.data.success) {
                    setStats(res.data.stats);
                    setRecentOrders(res.data.recentOrders || []);
                    setStockAlerts(res.data.stockAlerts || []);
                }
            } catch (err) {
                console.error("Dashboard API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getInitials = (name) => {
        if (!name) return "AD";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-bold text-sm text-green-800 tracking-wider bg-slate-50">
                Syncing Hariyali Ghar Data Engine...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 mt-16 font-sans bg-[#f8fafc] min-h-screen">

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                {getInitials(adminUser.fullname)}
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">{adminUser.fullname}</h3>
                                <span className="inline-block text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-md mt-1">
                                    Admin
                                </span>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        <nav className="flex flex-col space-y-1">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black bg-green-50 text-green-700 text-left">
                                <LayoutDashboard size={16} /> Overview
                            </button>
                            <Link to="/admin/manage-plants" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left transition">
                                <Leaf size={16} /> Manage Plants
                            </Link>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left transition">
                                <ShoppingBag size={16} /> Orders
                            </button>
                            <Link to="/admin/add-plant" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left transition">
                                <PlusCircle size={16} /> Add Plant
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Greeting Header Block */}
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Welcome back, {adminUser.fullname ? adminUser.fullname.split(" ")[0] : 'Admin'}!
                        </h1>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Here's what's happening with your nursery platform today</p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        {/* Total Orders */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-slate-800">{stats?.totalOrders ?? 0}</span>
                                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <ShoppingBag size={16} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Orders</p>
                                <span className="text-[10px] text-amber-600 font-bold">{stats?.pendingOrders ?? 0} pending</span>
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-slate-800">{stats?.totalUsers ?? 0}</span>
                                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                                    <Users size={16} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Users</p>
                                <span className="text-[10px] text-green-600 font-bold">{stats?.newUsersThisWeek ?? 0} new this week</span>
                            </div>
                        </div>

                        {/* Low Stock */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-slate-800">{stats?.lowStockCount ?? 0}</span>
                                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                                    <AlertTriangle size={16} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Low Stock</p>
                                <span className="text-[10px] text-rose-600 font-bold">{stats?.outOfStockCount ?? 0} out of stock</span>
                            </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-black text-slate-900">
                                    NPR {stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString() : 0}
                                </span>
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                    <DollarSign size={16} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Revenue</p>
                                <span className="text-[10px] text-blue-500 font-bold">From paid orders</span>
                            </div>
                        </div>

                    </div>

                    {/* Recent Orders & Low Stock List */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Recent Orders List */}
                        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-3">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Recent Orders</h3>
                            </div>
                            <div className="space-y-3">
                                {recentOrders.length === 0 ? (
                                    <p className="text-xs text-slate-400 font-medium text-center py-4">No recent orders yet.</p>
                                ) : (
                                    recentOrders.map((order, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition text-xs">
                                            <div>
                                                <p className="font-bold text-slate-800">ORD-00{order.id}</p>
                                                <p className="text-[11px] text-slate-400 font-medium">{order.customer || 'Unknown Customer'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-800">NPR {order.total ? Number(order.total).toLocaleString() : 0}</p>
                                                <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded ${order.status === 'Delivered' || order.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>{order.status}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Stock Alert Status List */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-3">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Low / Out of Stock</h3>
                            </div>
                            <div className="space-y-3">
                                {stockAlerts.length === 0 ? (
                                    <p className="text-xs text-slate-400 font-medium text-center py-4">All plant stocks healthy!</p>
                                ) : (
                                    stockAlerts.map((plant, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs p-1">
                                            <div className="flex items-center gap-2">
                                                <Leaf size={14} className="text-green-600" />
                                                <span className="text-slate-700 font-bold">{plant.name}</span>
                                            </div>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${plant.count === 0 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                                                }`}>{plant.status} ({plant.count} left)</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;