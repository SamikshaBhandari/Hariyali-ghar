import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Sun, Droplets, Heart, Star, ShoppingCart, Minus, Plus, ChevronLeft, Send } from 'lucide-react';

const PlantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plant, setPlant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');
    const [reviews, setReviews] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [relatedPlants, setRelatedPlants] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    // Review Form Input States
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const isUser = user && user.role === 'user';

    //Admin check role components ra Out of Stock status verification flags
    const isAdmin = user && (user.role === 'admin' || user.role === 'Admin');
    const isOutOfStock = plant && plant.stock_quantity === 0;

    // Fetch plant and review details
    const fetchPlantAndReviews = async () => {
        try {
            const plantRes = await axios.get(`http://localhost:5000/api/products/${id}`);
            setPlant(plantRes.data.data);

            //product to match backend route setup
            const reviewRes = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);

            if (reviewRes.data && reviewRes.data.success) {
                setReviews(reviewRes.data.reviews || []);
            } else {
                setReviews([]);
            }
        } catch (err) {
            console.error("Error loading plant data", err);
            setReviews([]);
        }
    };

    useEffect(() => {
        setQuantity(1);
        setExpandedId(null);
        fetchPlantAndReviews();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    useEffect(() => {
        if (plant && plant.category_id) {
            const fetchRelatedProducts = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/products/related/data`, {
                        params: { category_id: plant.category_id, current_id: plant.id }
                    });
                    if (res.data.success) {
                        setRelatedPlants(res.data.data);
                    }
                } catch (err) {
                    console.error("Error fetching related products:", err);
                }
            };
            fetchRelatedProducts();
            window.scrollTo(0, 0);
        }
    }, [plant]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Please login first to write a product review!");
            return navigate('/login');
        }

        if (!comment.trim()) {
            alert("Please type your feedback comment before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/reviews/add`, {
                product_id: id,
                rating: rating,
                comment: comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.success) {
                alert("Review added successfully!");
                setComment("");
                setRating(5);

                //product here as well
                const refreshRes = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
                if (refreshRes.data && refreshRes.data.success) {
                    setReviews(refreshRes.data.reviews || []);
                }
            }
        } catch (err) {
            console.error("Error adding review:", err);
            alert(err.response?.data?.message || "Failed to add review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddToCart = async () => {

        if (isAdmin) {
            alert("Admin accounts are not allowed to order plants!");
            return;
        }

        if (isOutOfStock) {
            alert("Sorry, this plant is currently out of stock!");
            return;
        }

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

    const reviewsCount = Array.isArray(reviews) ? reviews.length : 0;

    return (
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-10 font-sans bg-white relative">

            {/* Alert Notification */}
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

                {/* Left Side Image Container */}
                <div className="w-full lg:w-[420px] bg-gray-50 rounded-[28px] overflow-hidden shadow-sm border border-gray-100 relative">

                    {/* Image Out of Stock Layer */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center z-10 rounded-[28px]">
                            <span className="bg-red-600 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md tracking-wider">
                                OUT OF STOCK
                            </span>
                        </div>
                    )}

                    <div className="aspect-square flex items-center justify-center p-2">
                        <img
                            src={`http://localhost:5000/images/${plant.image_url}`}
                            alt={plant.name}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                </div>

                {/* Right Side Container */}
                <div className="w-full max-w-md space-y-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-green-600 font-bold text-[10px] uppercase tracking-[1px]">{plant.category_name}</span>
                            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mt-1">{plant.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /></div>
                                <span className="text-gray-400 text-[10px] font-medium">
                                    {Number(plant.average_rating || 0).toFixed(1)} ({reviewsCount} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Real Stock badges */}
                        <div className={`px-3 py-1 rounded-full border ${isOutOfStock
                            ? 'bg-red-50 border-red-100'
                            : 'bg-green-50 border-green-100'
                            }`}>
                            <span className={`text-[10px] font-bold ${isOutOfStock ? 'text-red-600' : 'text-green-700'
                                }`}>
                                {isOutOfStock ? "Out of Stock" : `In Stock (${plant.stock_quantity})`}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-1xl font-bold text-green-700">NPR {plant.price}</h2>

                    {/* Care Information */}
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

                        {/*warning block*/}
                        {isAdmin && (
                            <div className="p-3 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-lg border border-amber-100">
                                Items cannot be added to cart or ordered in Admin.
                            </div>
                        )}

                        {isOutOfStock && (
                            <div className="p-3 bg-red-50 text-red-700 text-[11px] font-bold rounded-lg border border-red-100">
                                This plant is currently out of stock and unavailable.
                            </div>
                        )}

                        {/* Quantity controls and Cart triggers */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg h-9 px-3 bg-white">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={isOutOfStock || isAdmin}
                                    className="p-1 text-gray-400 hover:text-green-700 transition disabled:opacity-20 disabled:cursor-not-allowed"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-bold text-md text-gray-700">
                                    {isOutOfStock || isAdmin ? 0 : quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    disabled={isOutOfStock || isAdmin}
                                    className="p-1 text-gray-400 hover:text-green-700 transition disabled:opacity-20 disabled:cursor-not-allowed"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || isAdmin}
                                className={`flex-1 text-white h-9 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-sm text-sm ${isOutOfStock
                                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                    : isAdmin
                                        ? 'bg-green-600 text-white-900 cursor-not-allowed opacity-75'
                                        : 'bg-green-700 hover:bg-green-800'
                                    }`}
                            >
                                <ShoppingCart size={18} />
                                {isOutOfStock ? "Unavailable" : isAdmin ? "Unavailable" : "Add to Cart"}
                            </button>
                        </div>

                        {!isAdmin && (
                            <button
                                onClick={() => isUser ? navigate('/cart') : alert("Please login first!")}
                                className="w-full border border-green-700 text-green-700 h-9 rounded-lg font-bold text-xs hover:bg-green-50 transition"
                            >
                                View Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Tabs Section */}
            <div className="mt-12 border border-gray-100 rounded-[24px] p-8 shadow-sm">
                <div className="flex gap-10 border-b border-gray-100 mb-6">
                    {['Description', 'Care Instructions', 'Reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-bold relative transition-all ${activeTab === tab ? 'text-green-700' : 'text-gray-400'}`}
                        >
                            {tab} {tab === 'Reviews' && `(${reviewsCount})`}
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
                        <div className="space-y-6">

                            {/* Review Submission Input Form */}
                            {token && !isAdmin ? (
                                <form onSubmit={handleReviewSubmit} className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3 max-w-xl">
                                    <h3 className="text-[11px] font-extrabold text-gray-800 uppercase tracking-wide">Write a Product Review</h3>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-500">Your Rating:</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    onClick={() => setRating(num)}
                                                    className="text-yellow-400 transition transform hover:scale-110"
                                                >
                                                    <Star size={14} fill={num <= rating ? "currentColor" : "none"} className={num <= rating ? "" : "text-gray-300"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            rows="2"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write your customer feedback here..."
                                            className="w-full bg-white text-gray-700 border border-gray-200 p-2 rounded-lg focus:outline-none focus:border-green-600 text-[11px] resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                                    >
                                        <Send size={10} /> {isSubmitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </form>
                            ) : token && isAdmin ? (
                                <div className="p-3 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-100 max-w-xl">
                                    Admin users cannot post reviews.
                                </div>
                            ) : (
                                <div className="p-3 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-100 max-w-xl">
                                    Please <Link to="/login" className="underline text-green-700">Login</Link> to write a review.
                                </div>
                            )}

                            {/* Reviews Dynamic List Loop */}
                            <div className="space-y-4 pt-2">
                                {reviewsCount > 0 ? reviews.map((r, i) => (
                                    <div key={i} className="border-b border-gray-50 pb-3 last:border-0">
                                        <div className="flex text-yellow-400 mb-1">
                                            {[...Array(Number(r.rating) || 5)].map((_, index) => (
                                                <Star key={index} size={10} fill="currentColor" />
                                            ))}
                                        </div>
                                        <p className="font-bold text-gray-800 text-[11px]">{r.fullname || "Anonymous Buyer"}</p>
                                        <p className="text-gray-500 italic mt-1 font-medium text-[10px]">"{r.comment}"</p>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 text-xs italic py-2">No reviews found for this plant yet. Be the first one to review!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/*related product*/}
            {relatedPlants.length > 0 && (
                <div className="mt-16 border-t border-gray-100 pt-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-tight">
                        Similar Plants
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedPlants.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50 flex flex-col group"
                            >
                                <Link to={`/plants/${item.id}`} className="relative aspect-[4/3] overflow-hidden cursor-pointer block">
                                    <img
                                        src={`http://localhost:5000/images/${item.image_url}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {item.stock_quantity === 0 && (
                                        <div className="absolute top-3 right-3 z-20">
                                            <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="text-[9px] font-bold text-green-700 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                            {item.category_name || plant.category_name || "Plant"}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link to={`/plants/${item.id}`} className="hover:text-green-700 transition-colors">
                                            <h3 className="text-lg font-bold text-gray-800 tracking-tight leading-tight cursor-pointer">
                                                {item.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                                            <Star
                                                size={12}
                                                className={item.average_rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                            />
                                            <span className="text-gray-500 text-[11px] font-bold">
                                                {item.average_rating > 0 ? Number(item.average_rating).toFixed(1) : "New"}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-[11px] leading-relaxed mb-4">
                                        {item.description && item.description.length > 60 ? (
                                            <>
                                                {expandedId === item.id ? item.description : `${item.description.substring(0, 60)}...`}
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                                    className="text-green-600 font-bold ml-1 hover:underline cursor-pointer"
                                                >
                                                    {expandedId === item.id ? "Show Less" : "Read More"}
                                                </button>
                                            </>
                                        ) : (
                                            item.description || "A beautiful addition to your space collection."
                                        )}
                                    </p>

                                    {/* Bottom Pricing & Cart Icon box mapping */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-sm font-black text-green-700">
                                            NPR {item.price}
                                        </span>

                                        <Link
                                            to={`/plants/${item.id}`}
                                            className="p-2.5 rounded-xl transition-all duration-300 active:scale-90 shadow-sm border bg-green-50 text-green-700 hover:bg-green-700 hover:text-white border-green-100"
                                        >
                                            <ShoppingCart size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlantDetail;