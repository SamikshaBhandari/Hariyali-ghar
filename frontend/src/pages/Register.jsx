import React, { useState } from "react";
import { UseNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
    const navigate = UseNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        mobile: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match!");
        }

        try {
            const res = await api.post('/users/signup', {
                fullname: formData.fullname,
                email: formData.email,
                mobile: formData.mobile,
                address: formData.address,
                password: formData.password
            });

            alert(res.data.message);

            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            alert(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div>

        </div>
    );
};

export default Register;