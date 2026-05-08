import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [role, setRole] = useState('user');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

};

export default Login;