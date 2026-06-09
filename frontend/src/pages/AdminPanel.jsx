import React, { useEffect } from 'react';
import { Users, ShoppingBag, BarChart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Control Panel</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Management */}
                    <div
                        onClick={() => navigate('/admin/users')}
                        className="bg-white p-8 rounded-2xl shadow-sm cursor-pointer hover:bg-green-50 transition border border-gray-100"
                    >
                        <Users className="text-green-700 mb-4" size={32} />
                        <h2 className="font-bold text-lg">Manage Users</h2>
                        <p className="text-sm text-gray-400">View and manage registered users.</p>
                    </div>

                    {/* Product Management */}
                    <div onClick={() => navigate('/admin/manage-plants')} className="bg-white p-8 rounded-2xl shadow-sm cursor-pointer hover:bg-green-50 transition border border-gray-100">
                        <ShoppingBag className="text-green-700 mb-4" size={32} />
                        <h2 className="font-bold text-lg">Manage Products</h2>
                        <p className="text-sm text-gray-400">Add, edit, or remove plants.</p>
                    </div>

                    {/* Orders Overview */}
                    <div onClick={() => navigate('/admin/orders')} className="bg-white p-8 rounded-2xl shadow-sm cursor-pointer hover:bg-green-50 transition border border-gray-100">
                        <BarChart className="text-green-700 mb-4" size={32} />
                        <h2 className="font-bold text-lg">View Orders</h2>
                        <p className="text-sm text-gray-400">Track all customer orders.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;