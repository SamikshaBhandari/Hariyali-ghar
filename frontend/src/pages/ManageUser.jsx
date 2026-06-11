import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.data);
        } catch (err) { console.error("Error:", err); }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';

        const isConfirmed = window.confirm(
            `Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} this user?`
        );

        if (!isConfirmed) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/toggle-status',
                { id, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchUsers();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status!");
        }
    };

    useEffect(() => { fetchUsers(); }, []);


    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center mb-6 gap-1 text-green-700 hover:text-green-800 transition-colors font-medium"
            >
                <ArrowLeft size={22} />
                <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 text-gray-600 font-semibold">Name</th>
                            <th className="p-4 text-gray-600 font-semibold">Email</th>
                            <th className="p-4 text-gray-600 font-semibold">Status</th>
                            <th className="p-4 text-gray-600 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-700">{user.fullname}</td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => toggleStatus(user.id, user.status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${user.status === 'active'
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                            : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                            }`}>
                                        {user.status === 'active' ? 'Block User' : 'Unblock User'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ManageUser;