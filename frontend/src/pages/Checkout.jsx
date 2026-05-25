import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Truck, Wallet, CheckCircle } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states matches
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        phoneNumber: '',
        emailAddress: '',
        city: '',
        address: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        // User profiling setup
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setShippingDetails(prev => ({
                ...prev,
                fullName: user.fullname || '',
                emailAddress: user.email || ''
            }));
        }

        // Cart items validation loading block
        const fetchCheckoutData = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await axios.get('http://localhost:5000/api/cart/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.success) {
                    setCartItems(res.data.data || []);
                }
            } catch (err) {
                console.error("Error fetching checkout data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, [token, navigate]);

    //Total amount calculate logic 
    const totalItems = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const subtotal = cartItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
    const deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : 100;
    const total = subtotal + deliveryFee;
    const remainingForFreeDelivery = 1500 - subtotal;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!shippingDetails.address.trim() || !shippingDetails.phoneNumber.trim()) {
            alert("Please enter mandatory fields: Address and Phone Number!");
            return;
        }

        setIsProcessing(true);

        const formattedAddress = shippingDetails.city.trim()
            ? `${shippingDetails.address.trim()}, ${shippingDetails.city.trim()}`
            : shippingDetails.address.trim();

        // Common Payload Structure for both checkout pipelines
        const payload = {
            address: formattedAddress,
            phone_number: shippingDetails.phoneNumber.trim(),
            payment_method: paymentMethod
        };

        if (paymentMethod === 'eSewa') {
            try {
                // Real temporary unpaid order
                const createOrderRes = await axios.post('http://localhost:5000/api/orders/place', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (createOrderRes.data && createOrderRes.data.success) {
                    const databaseOrderId = createOrderRes.data.orderId || createOrderRes.data.data?.id;

                    if (!databaseOrderId) {
                        alert("Database configuration mismatch: Cannot parse numeric Order ID token.");
                        setIsProcessing(false);
                        return;
                    }

                    // Extract real order
                    const paymentRes = await axios.post('http://localhost:5000/api/payment/esewa-initiate', {
                        amount: total,
                        orderId: databaseOrderId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (paymentRes.data && paymentRes.data.success) {
                        const p = paymentRes.data.payment_data;

                        // Production form schema 
                        const form = document.createElement('form');
                        form.setAttribute('method', 'POST');
                        form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

                        //This array is strictly structured in alphabetical order for eSewa v2
                        const sortedFields = [
                            { name: "amount", value: p.amount },
                            { name: "failure_url", value: p.failure_url },
                            { name: "product_code", value: p.product_code },
                            { name: "product_delivery_charge", value: p.product_delivery_charge },
                            { name: "product_service_charge", value: p.product_service_charge },
                            { name: "signature", value: p.signature },
                            { name: "signed_field_names", value: p.signed_field_names },
                            { name: "success_url", value: p.success_url },
                            { name: "tax_amount", value: p.tax_amount },
                            { name: "total_amount", value: p.total_amount },
                            { name: "transaction_uuid", value: p.transaction_uuid }
                        ];

                        sortedFields.forEach(field => {
                            const hiddenField = document.createElement('input');
                            hiddenField.setAttribute('type', 'hidden');
                            hiddenField.setAttribute('name', field.name);
                            hiddenField.setAttribute('value', field.value);
                            form.appendChild(hiddenField);
                        });

                        document.body.appendChild(form);
                        form.submit();
                    }
                }
            } catch (err) {
                console.error("eSewa infrastructure pipeline setup broken:", err);
                alert(err.response?.data?.message || "Failed to initialize standard eSewa process.");
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/orders/place', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.success) {
                window.dispatchEvent(new Event('cartUpdated'));
                setOrderSuccess(true);
            }
        } catch (err) {
            console.error("Order payload dispatcher broken:", err);
            alert(err.response?.data?.message || "Failed to submit checkout configurations.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-green-800">Processing Pipeline Summary...</div>;

    if (orderSuccess) {
        return (
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center justify-center font-sans bg-white min-h-screen text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-100">
                    <CheckCircle size={36} className="stroke-[1.5]" />
                </div>

                <h1 className="text-2xl font-extrabold text-slate-800 mb-3">Order Placed Successfully!</h1>
                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed mb-8">
                    Thank you! Your order has been confirmed. Your plants are on their way to you!
                </p>

                <div className="w-full max-w-md bg-green-50/40 border border-green-100 rounded-2xl p-5 text-left mb-8 space-y-3">
                    <p className="text-xs font-bold text-green-800 flex items-center gap-2">
                        <img src="" alt="" /><Truck size={14} /> What happens next?
                    </p>
                    <ul className="space-y-2 text-[11px] text-slate-600 font-medium pl-5 list-disc">
                        <li>Order confirmation sent to your email</li>
                        <li>We'll prepare your plants with care</li>
                        <li>Delivery within 2-3 business days</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button onClick={() => navigate('/')} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-8 py-2.5 rounded-full transition shadow-sm">
                        Go to Home
                    </button>
                    <button onClick={() => navigate('/plants')} className="w-full sm:w-auto border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs px-8 py-2.5 rounded-full transition">
                        Shop More Plants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-10 font-sans bg-slate-20 min-h-screen">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">

                    {/* Shipping container */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                            <h2 className="text-sm font-black text-slate-800">Shipping Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Name</label>
                                <input type="text" name="fullName" value={shippingDetails.fullName} disabled className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone Number *</label>
                                <input type="text" name="phoneNumber" value={shippingDetails.phoneNumber} onChange={handleInputChange} placeholder="Enter your number" className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-green-600" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Email Address</label>
                                <input type="email" name="emailAddress" value={shippingDetails.emailAddress} disabled className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">City</label>
                                <input type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-green-600" placeholder='Enter your city' />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Shipping Address *</label>
                                <input type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} placeholder="Enter your shipping address" className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Payment container */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                            <h2 className="text-sm font-black text-slate-800">Payment Method</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div onClick={() => setPaymentMethod('COD')} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-green-500 bg-green-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-100 text-green-700">
                                        <Truck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Cash on Delivery</p>
                                        <p className="text-[10px] text-slate-400">Pay when you receive your order</p>
                                    </div>
                                </div>
                                <input type="radio" checked={paymentMethod === 'COD'} readOnly className="accent-green-600" />
                            </div>

                            <div onClick={() => setPaymentMethod('eSewa')} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'eSewa' ? 'border-green-500 bg-green-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">eSewa</p>
                                        <p className="text-[10px] text-slate-400">Pay securely via eSewa wallet</p>
                                    </div>
                                </div>
                                <input type="radio" checked={paymentMethod === 'eSewa'} readOnly className="accent-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pipeline Area */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-sm font-black text-slate-800 border-b border-slate-50 pb-3">Order Summary</h2>

                    <div className="max-h-25 overflow-y-auto space-y-3 pr-1">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <img src={`http://localhost:5000/images/${item.image_url}`} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                                    <div>
                                        <p className="font-bold text-slate-700 text-[11px] truncate max-w-[120px]">{item.name}</p>
                                        <p className="text-slate-400 text-[10px]">x{item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-600">NPR {item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-50 pt-3">
                        <div className="flex justify-between text-slate-400 font-medium">
                            <span>Subtotal ({totalItems} items)</span>
                            <span className="text-slate-700 font-bold">NPR {subtotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 font-medium">
                            <span>Delivery</span>
                            <span className={deliveryFee === 0 ? "text-green-600 font-bold" : "text-slate-700 font-bold"}>
                                {deliveryFee === 0 ? "Free" : `NPR ${deliveryFee}`}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                        <span className="font-black text-slate-800 text-sm">Total</span>
                        <span className="text-lg font-black text-green-700">NPR {total}</span>
                    </div>

                    {remainingForFreeDelivery > 0 && (
                        <div className="bg-orange-50 border border-orange-100 text-center py-2 px-3 rounded-xl">
                            <p className="text-[10px] text-orange-700 font-bold">
                                Add NPR {remainingForFreeDelivery} more for free delivery!
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm disabled:bg-slate-300"
                    >
                        {isProcessing ? "Processing..." : `Place Order (${paymentMethod})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;