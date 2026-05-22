import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserDashboard from './pages/UserDashboard';
import MyOrders from './pages/MyOrders';
import UserActivity from './pages/UserActivity';
import UserProfile from './pages/UserProfile';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/plants" element={<Plants />} />
                    <Route path="/plants/:id" element={<PlantDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/user/dashboard" element={<UserDashboard />} />
                    <Route path="/myorders" element={<MyOrders />} />
                    <Route path="/activity" element={<UserActivity />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;