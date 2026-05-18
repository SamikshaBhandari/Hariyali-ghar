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
                // Cart endpoint updates directly to local server
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

        //Exact Request Payload mapping 
        const formattedAddress = shippingDetails.city.trim()
            ? `${shippingDetails.address.trim()}, ${shippingDetails.city.trim()}`
            : shippingDetails.address.trim();

        const payload = {
            address: formattedAddress,
            phone_number: shippingDetails.phoneNumber.trim(),
            payment_method: paymentMethod
        };

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
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to submit checkout configurations.");
            }
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
                        <Truck size={14} /> What happens next?
                    </p>
                    <ul className="space-y-2 text-[11px] text-slate-600 font-medium pl-5 list-disc">
                        <li>Order confirmation sent to your email</li>
                        <li>We'll prepare your plants with care</li>
                        <li>Delivery within 2-3 business days</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-8 py-2.5 rounded-full transition shadow-sm"
                    >
                        Go to Home
                    </button>
                    <button
                        onClick={() => navigate('/plants')}
                        className="w-full sm:w-auto border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs px-8 py-2.5 rounded-full transition"
                    >
                        Shop More Plants
                    </button>
                </div>
            </div>
        );
    }


};

export default Checkout;