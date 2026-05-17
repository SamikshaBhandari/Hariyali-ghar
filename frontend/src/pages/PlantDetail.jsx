import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Sun, Droplets, Heart, Star, ShoppingCart, Minus, Plus, ChevronLeft } from 'lucide-react';

const PlantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plant, setPlant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');
    const [reviews, setReviews] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const isUser = user && user.role === 'user';

    useEffect(() => {
        const fetchPlantData = async () => {
            try {
                const plantRes = await axios.get(`http://localhost:5000/api/products/${id}`);
                setPlant(plantRes.data.data);

                const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
                setReviews(reviewRes.data.data || []);
            } catch (err) {
                console.error("Error loading plant data", err);
            }
        };
        fetchPlantData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = async () => {
        if (!isUser) {
            alert("Please login first!");
            return navigate('/login');
        }
        try {
            await axios.post('http://localhost:5000/api/cart/add',
                { product_id: plant.id, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        } catch (err) {
            alert("Failed to add to cart.");
        }
    };

    if (!plant) return <div className="p-20 text-center font-bold text-green-800">Hariyali Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-10 font-sans bg-white relative">

            {/*alert notification */}
            {showNotification && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 animate-bounce">
                    <div className="bg-green-600 p-1 rounded-full text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <span className="text-xs font-semibold">{plant.name} added to cart!</span>
                </div>
            )}

            {/* Back to Home Navigation */}
            <div className="mb-6">
                <Link to="/" className="inline-flex items-center text-green-700 font-bold hover:text-green-900 transition gap-1 text-xs">
                    <ChevronLeft size={16} /> Back to Home
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">

                {/* left side image container  */}
                <div className="w-full lg:w-[420px] bg-gray-50 rounded-[28px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="aspect-square flex items-center justify-center p-2">
                        <img
                            src={`http://localhost:5000/images/${plant.image_url}`}
                            alt={plant.name}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                </div>

                {/* right side container */}
                <div className="w-full max-w-md space-y-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-green-600 font-bold text-[10px] uppercase tracking-[1px]">{plant.category_name}</span>
                            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mt-1">{plant.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /></div>
                                <span className="text-gray-400 text-[10px] font-medium">
                                    {Number(plant.average_rating || 0).toFixed(1)} ({reviews.length} reviews)
                                </span>
                            </div>
                        </div>

                        {/* real stock  */}
                        <div className="bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                            <span className="text-green-700 text-[10px] font-bold">
                                In Stock ({plant.stock_quantity})
                            </span>
                        </div>
                    </div>

                    <h2 className="text-1xl font-bold text-green-700">NPR {plant.price}</h2>

                    {/* care information*/}
                    <div className="flex gap-2">
                        <div className="bg-gray-50 p-3 rounded-xl flex-1 text-center border border-green-50">
                            <Sun className="mx-auto text-green-600 mb-1" size={16} />
                            <p className="text-[8px] text-gray-400 font-bold uppercase">Sunlight</p>
                            <p className="text-[9px] font-extrabold text-gray-700 leading-tight">{plant.sunlight}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl flex-1 text-center border border-green-50">
                            <Droplets className="mx-auto text-green-600 mb-1" size={16} />
                            <p className="text-[8px] text-gray-400 font-bold uppercase">Watering</p>
                            <p className="text-[9px] font-extrabold text-gray-700 leading-tight">{plant.watering}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl flex-1 text-center border border-green-50">
                            <Heart className="mx-auto text-green-600 mb-1" size={16} />
                            <p className="text-[8px] text-gray-400 font-bold uppercase">Difficulty</p>
                            <p className="text-[9px] font-extrabold text-gray-700">Easy</p>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="pt-2 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg h-9 px-3 bg-white">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 text-gray-400 hover:text-green-700 transition"><Minus size={14} /></button>
                                <span className="w-8 text-center font-bold text-md">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="p-1 text-gray-400 hover:text-green-700 transition"><Plus size={12} /></button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-green-700 text-white h-9 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-sm text-sm"
                            >
                                <ShoppingCart size={18} /> Add to Cart
                            </button>
                        </div>
                        <button
                            onClick={() => isUser ? navigate('/cart') : alert("Please login first!")}
                            className="w-full border border-green-700 text-green-700 h-9 rounded-lg font-bold text-xs hover:bg-green-50 transition"
                        >
                            View Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 border border-gray-100 rounded-[24px] p-8 shadow-sm">
                <div className="flex gap-10 border-b border-gray-100 mb-6">
                    {['Description', 'Care Instructions', 'Reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-bold relative transition-all ${activeTab === tab ? 'text-green-700' : 'text-gray-400'}`}
                        >
                            {tab} {tab === 'Reviews' && `(${reviews.length})`}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-green-700 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="text-gray-600 leading-relaxed text-[11px]">
                    {activeTab === 'Description' && <p>{plant.description}</p>}
                    {activeTab === 'Care Instructions' && <p>{plant.care_tips}</p>}
                    {activeTab === 'Reviews' && (
                        <div className="space-y-4">
                            {reviews.length > 0 ? reviews.map((r, i) => (
                                <div key={i} className="border-b border-gray-50 pb-3">
                                    <div className="flex text-yellow-400 mb-1">
                                        {[...Array(Number(r.rating) || 5)].map((_, index) => <Star key={index} size={10} fill="currentColor" />)}
                                    </div>
                                    <p className="font-bold text-gray-800 text-[11px]">{r.user_name || "User"}</p>
                                    <p className="text-gray-500 italic mt-1 font-medium text-[10px]">"{r.comment}"</p>
                                </div>
                            )) : <p className="text-gray-400 ">No real reviews found for this plant yet.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantDetail;