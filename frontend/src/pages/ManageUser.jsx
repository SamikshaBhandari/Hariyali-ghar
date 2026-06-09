import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUser = () => {
    const [users, setUsers] = useState([]);

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
            alert("Status update garna milena!");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-6">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead><tr className="bg-gray-100"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-4">{user.fullname}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.status}</td>
                                <td className="p-4">
                                    <button onClick={() => toggleStatus(user.id, user.status)}
                                        className={`px-3 py-1 rounded ${user.status === 'active' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                                        {user.status === 'active' ? 'Block' : 'Unblock'}
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