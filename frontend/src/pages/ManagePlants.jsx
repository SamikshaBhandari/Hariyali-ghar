import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Leaf,
    ShoppingBag,
    PlusCircle,
    Trash2,
    Edit3,
    UploadCloud,
    Check,
    X
} from 'lucide-react';

const API = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

const ManagePlants = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [adminUser, setAdminUser] = useState({ fullname: 'Admin' });

    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
        name: '', price: '', stock_quantity: '', category_id: '', description: '', sunlight: '', watering: '', care_tips: '', image: null
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setAdminUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/products/all`, { headers: { Authorization: `Bearer ${token}` } });
            setProducts(res.data.data || res.data.products || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const startEdit = (p) => {
        setEditingId(p.id);
        setEditForm({
            name: p.name,
            price: p.price,
            stock_quantity: p.stock_quantity,
            category_id: p.category_id || '',
            description: p.description || '',
            sunlight: p.sunlight || '',
            watering: p.watering || '',
            care_tips: p.care_tips || '',
            image: null
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setEditForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.keys(editForm).forEach(key => {
                if (editForm[key] !== null) fd.append(key, editForm[key]);
            });

            await axios.put(`${API}/products/update/${editingId}`, fd, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });

            setEditingId(null);
            fetchProducts();
        } catch (err) { alert(err.response?.data?.message || 'Update failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plant?')) return;
        try {
            await axios.delete(`${API}/products/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setProducts(products.filter(p => p.id !== id));
        } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 mt-16 font-sans bg-slate-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 sticky top-24">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                {adminUser.fullname[0]}
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
                            <Link to="/admin/manage-plants" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black bg-green-50 text-green-700 text-left">
                                <Leaf size={16} /> Manage Plants
                            </Link>
                            <Link to="/admin/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left transition">
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
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Plant Records</h1>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Quickly view, update metadata, or delete inventory in real-time</p>
                        </div>
                        <Link to="/admin/add-plant" className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition">
                            <PlusCircle size={14} /> Add New Plant
                        </Link>
                    </div>

                    {/* Plant List Container */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                        {loading ? (
                            <p className="text-xs text-slate-400 font-medium text-center py-12">Loading store inventory...</p>
                        ) : products.length === 0 ? (
                            <p className="text-xs text-slate-400 font-medium text-center py-12">No plant entries found.</p>
                        ) : (
                            <div className="space-y-4">
                                {products.map(p => {
                                    if (editingId === p.id) {
                                        return (
                                            <form key={p.id} onSubmit={handleUpdateSubmit} className="border-2 border-green-500 bg-green-50/10 rounded-2xl p-4 space-y-3 text-xs animate-in fade-in duration-200">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="font-bold text-slate-500 block mb-1">Plant Name</label>
                                                        <input name="name" value={editForm.name} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white focus:outline-none focus:border-green-500" required />
                                                    </div>
                                                    <div>
                                                        <label className="font-bold text-slate-500 block mb-1">Price (NPR)</label>
                                                        <input name="price" type="number" value={editForm.price} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white focus:outline-none focus:border-green-500" required />
                                                    </div>
                                                    <div>
                                                        <label className="font-bold text-slate-500 block mb-1">Stock Quantity</label>
                                                        <input name="stock_quantity" type="number" value={editForm.stock_quantity} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white focus:outline-none focus:border-green-500" required />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="font-bold text-slate-500 block mb-1">Category ID</label>
                                                        <input name="category_id" value={editForm.category_id} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white" />
                                                    </div>
                                                    <div>
                                                        <label className="font-bold text-amber-600 block mb-1">Sunlight</label>
                                                        <input name="sunlight" value={editForm.sunlight} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white" placeholder="Indirect Sunlight" />
                                                    </div>
                                                    <div>
                                                        <label className="font-bold text-blue-500 block mb-1">Watering</label>
                                                        <input name="watering" value={editForm.watering} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white" placeholder="Twice a week" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="font-bold text-slate-500 block mb-1">Short Description</label>
                                                        <textarea name="description" value={editForm.description} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white" rows={1} />
                                                    </div>
                                                    <div>
                                                        <label className="font-bold text-slate-500 block mb-1">Care Tips (Tab Content)</label>
                                                        <textarea name="care_tips" value={editForm.care_tips} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-xl bg-white" rows={1} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="font-bold text-slate-500 block mb-1">Change Image (Optional)</label>
                                                    <input name="image" type="file" onChange={handleInputChange} className="text-[11px] text-slate-500" />
                                                </div>

                                                <div className="flex gap-2 pt-1 justify-end">
                                                    <button type="button" onClick={cancelEdit} className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 font-bold flex items-center gap-1 transition">
                                                        <X size={13} /> Cancel
                                                    </button>
                                                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition">
                                                        <Check size={13} /> Save
                                                    </button>
                                                </div>
                                            </form>
                                        );
                                    }

                                    return (
                                        <div key={p.id} className="border border-slate-100/70 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50/30 transition bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                                                    {p.image_url ? (
                                                        <img src={`${API.replace('/api', '')}/images/${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Leaf className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-800 text-sm">{p.name}</h4>
                                                    <p className="text-[11px] font-bold text-green-600 mt-0.5">NPR {Number(p.price).toLocaleString()}</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.stock_quantity === 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                                                            Stock: {p.stock_quantity}
                                                        </span>
                                                        {p.sunlight && <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md">{p.sunlight}</span>}
                                                        {p.watering && <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">{p.watering}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button onClick={() => startEdit(p)} className="p-2 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 text-slate-500 rounded-xl border border-slate-100 transition shadow-sm flex items-center gap-1 font-bold text-[11px]">
                                                    <Edit3 size={13} /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl border border-slate-100 transition shadow-sm flex items-center gap-1 font-bold text-[11px]">
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagePlants;