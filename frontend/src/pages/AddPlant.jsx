import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Leaf,
    ShoppingBag,
    PlusCircle,
    UploadCloud,
    ArrowLeft,
    Check
} from 'lucide-react';

const API = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

const AddPlant = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [adminUser, setAdminUser] = useState({ fullname: 'Admin' });
    const [loading, setLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        description: '',
        sunlight: '',
        watering: '',
        care_tips: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setAdminUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                fd.append(key, formData[key]);
            });
            if (image) {
                fd.append('image', image);
            }

            await axios.post(`${API}/products/add`, fd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Plant added successfully!');
            navigate('/admin/manage-plants');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add plant');
        } finally {
            setLoading(false);
        }
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
                            <Link to="/admin/manage-plants" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 text-left transition">
                                <Leaf size={16} /> Manage Plants
                            </Link>
                            <Link to="/admin/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left transition">
                                <ShoppingBag size={16} /> Orders
                            </Link>
                            <Link to="/admin/add-plant" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black bg-green-50 text-green-700 text-left">
                                <PlusCircle size={16} /> Add Plant
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Form Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/manage-plants" className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition text-slate-600">
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Plant Entry</h1>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Introduce a new plant species or product to the marketplace inventory</p>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
                        <form onSubmit={handleSubmit} className="space-y-6 text-xs">

                            {/*Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Plant Name *</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" placeholder="e.g.Money plant" required />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Price (NPR) *</label>
                                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" placeholder="e.g.300" required />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Initial Stock Quantity *</label>
                                    <input name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" placeholder="e.g.25" required />
                                </div>
                            </div>

                            {/*Category & Details*/}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Category ID</label>
                                    <input name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" placeholder="e.g.5" />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Sunlight Requirement</label>
                                    <input name="sunlight" value={formData.sunlight} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" placeholder="e.g.Indirect Sunlight" />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Watering Schedule</label>
                                    <input name="watering" value={formData.watering} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" placeholder="e.g.Every 3 days" />
                                </div>
                            </div>

                            {/*Descriptions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Short Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" rows={3} placeholder="Brief details about the plant look and size..." />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1.5">Care Tips (Tab Content)</label>
                                    <textarea name="care_tips" value={formData.care_tips} onChange={handleInputChange} className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:outline-none focus:border-green-500 text-slate-800" rows={3} placeholder="Provide instructions for soil, temperature, etc..." />
                                </div>
                            </div>

                            {/*Image Upload Section*/}
                            <div className="space-y-2">
                                <label className="font-bold text-slate-700 block">Plant Image</label>
                                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50/60 transition cursor-pointer min-h-[110px] flex items-center justify-center">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />

                                    {imagePreview ? (
                                        <div className="flex items-center gap-4 text-left pointer-events-none">
                                            <img src={imagePreview} alt="Selected Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                                            <div>
                                                <p className="font-bold text-slate-800 text-xs">{image?.name}</p>
                                                <p className="text-[11px] text-green-600 font-semibold mt-0.5">Click or drag again to change photo</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
                                            <UploadCloud size={24} className="text-slate-400" />
                                            <p className="font-semibold text-[11px]">Click or drag a file to upload plant photo</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/*Action Buttons*/}
                            <div className="flex gap-3 justify-end pt-2">
                                <Link to="/admin/manage-plants" className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 font-bold transition flex items-center gap-1.5">
                                    Cancel
                                </Link>
                                <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition disabled:bg-green-400">
                                    <Check size={14} /> {loading ? 'Adding...' : 'Publish Plant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddPlant;