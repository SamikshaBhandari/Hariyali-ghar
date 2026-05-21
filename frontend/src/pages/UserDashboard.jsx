import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard, ShoppingBag, Activity,
    ShoppingBag as BagIcon, DollarSign, ArrowRight,
    Search, User, ShoppingCart, CreditCard
} from 'lucide-react';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                // Real Orders Fetching from Database
                const orderRes = await axios.get('http://localhost:5000/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (orderRes.data && orderRes.data.success) {
                    setOrders(orderRes.data.data || []);
                }

            } catch (err) {
                console.error("Error fetching dashboard metadata:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, navigate]);

    if (loading) return <div className="p-20 text-center font-bold text-green-800">Loading Dashboard Pipeline...</div>;

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 font-sans bg-[#f8fafc] min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Side Navigation Sidebar panel */}
                <div className="w-full lg:w-64 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.fullname || 'User'}&background=random`}
                            className="w-10 h-10 rounded-full object-cover border"
                            alt="Avatar"
                        />
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-sm truncate max-w-[140px]">{user?.fullname}</h3>
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 font-bold px-2 py-0.5 rounded-full">
                                User
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        {[
                            { name: 'Overview', icon: <LayoutDashboard size={16} /> },
                            { name: 'My Orders', icon: <ShoppingBag size={16} />, route: '/myorders' },
                            { name: 'Activity', icon: <Activity size={16} />, route: '/activity' }
                        ].map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => {
                                    setActiveTab(tab.name);
                                    if (tab.route) navigate(tab.route);
                                }}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${activeTab === tab.name
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Main Dashboard*/}
                <div className="flex-1 w-full space-y-8">
                    <div>
                        <h1 className="text-xl font-black text-slate-800 flex items-center gap-1.5">
                            Welcome back, {user?.fullname?.split(' ')[0]}!
                        </h1>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Here's what's happening with your account</p>
                    </div>

                    {/* Dashboard Grid Elements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="p-2 w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                                <BagIcon size={16} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-800">{totalOrders}</h4>
                            <p className="text-[11px] text-slate-400 font-bold mt-0.5">Total Orders</p>
                            <span className="text-[9px] text-green-600 font-bold absolute bottom-4 right-4">Active data</span>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="p-2 w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                                <DollarSign size={16} />
                            </div>
                            <h4 className="text-xl font-black text-slate-800">NPR {totalSpent.toLocaleString()}</h4>
                            <p className="text-[11px] text-slate-400 font-bold mt-0.5">Total Spent</p>
                            <span className="text-[9px] text-slate-400 font-bold absolute bottom-4 right-4">Lifetime value</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                                    <h3 className="text-xs font-black text-slate-800">Recent Orders</h3>
                                    <Link to="/myorders" className="text-[10px] text-slate-400 hover:text-green-600 font-bold flex items-center gap-0.5">
                                        View All <ArrowRight size={10} />
                                    </Link>
                                </div>

                                {orders.length === 0 ? (
                                    <p className="text-center text-slate-400 text-xs py-10 font-bold">No orders found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.slice(0, 3).map((order) => (
                                            <div key={order.id} className="flex justify-between items-center border-b border-slate-50/60 pb-3 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-700">ORD-00{order.id}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{order.address}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-slate-800">NPR {Number(order.total_amount).toLocaleString()}</p>
                                                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                        order.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                            order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                                'bg-green-50 text-green-600'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Action Navigation Shortcuts */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
                            <h3 className="text-xs font-black text-slate-800 border-b border-slate-50 pb-3">Quick Actions</h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div onClick={() => navigate('/plants')} className="bg-green-50/40 border border-green-100/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-green-50 transition duration-200">
                                    <Search size={18} className="text-green-600 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-700">Browse Plants</span>
                                </div>
                                <div onClick={() => navigate('/cart')} className="bg-amber-50/30 border border-amber-100/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/60 transition duration-200">
                                    <ShoppingCart size={18} className="text-amber-600 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-700">View Cart</span>
                                </div>
                                <div onClick={() => navigate('/profile')} className="bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/60 transition duration-200">
                                    <User size={18} className="text-blue-600 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-700">My Profile</span>
                                </div>
                                <div
                                    onClick={async () => {
                                        try {
                                            const res = await axios.get('http://localhost:5000/api/cart/all', {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            if (res.data && res.data.success && res.data.data && res.data.data.length > 0) {
                                                navigate('/checkout');
                                            } else {
                                                alert("Your cart is empty! Please add some plants first.");
                                                navigate('/cart');
                                            }
                                        } catch (err) {
                                            navigate('/cart');
                                        }
                                    }}
                                    className="bg-emerald-50/40 border border-emerald-100/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50 transition duration-200"
                                >
                                    <CreditCard size={18} className="text-emerald-600 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-700">Checkout</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserDashboard;