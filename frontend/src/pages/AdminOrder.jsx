import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Leaf,
    ShoppingBag,
    PlusCircle,
    Clock,
    CheckCircle2,
    Eye,
    X
} from 'lucide-react';

const API = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

const AdminOrder = () => {
    const token = localStorage.getItem('token');
    const [adminUser, setAdminUser] = useState({ fullname: 'Admin' });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

    // Dropdown updates loading handles
    const [updatingId, setUpdatingId] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalItems, setModalItems] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setAdminUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/orders/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.success) {
                const fetchedOrders = res.data.data || [];
                setOrders(fetchedOrders);

                // Live Counters Calculation Based on status field
                const pending = fetchedOrders.filter(o => o.status?.toLowerCase() === 'pending').length;
                const completed = fetchedOrders.filter(o => o.status?.toLowerCase() === 'delivered').length;
                setStats({ total: fetchedOrders.length, pending, completed });
            }
        } catch (err) {
            console.error("Error fetching orders from MySQL database:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, currentOrder, newStatus) => {
        try {
            setUpdatingId(orderId);
            await axios.put(`${API}/orders/update/${orderId}`,
                {
                    status: newStatus,
                    payment_status: currentOrder.payment_status || 'unpaid'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Order status updated to ${newStatus}!`);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    // View Plants Breakdown inside that target order
    const viewOrderDetails = async (order) => {
        setSelectedOrder(order);
        setModalItems([]);
        try {
            setModalLoading(true);
            const res = await axios.get(`${API}/orders/details/${order.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                setModalItems(res.data.items || []);
            }
        } catch (err) {
            console.error("Error fetching items payload:", err);
            setModalItems([]);
        } finally {
            setModalLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'shipped': return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'delivered': return 'bg-green-50 border-green-200 text-green-700';
            case 'cancelled': return 'bg-red-50 border-red-200 text-red-700';
            default: return 'bg-slate-50 border-slate-200 text-slate-600';
        }
    };


};

export default AdminOrder;