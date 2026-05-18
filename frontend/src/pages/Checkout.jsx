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


};

export default Checkout;