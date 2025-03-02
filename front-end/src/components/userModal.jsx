import { useState, useEffect } from "react";
import axios from "axios";

const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({ name: "", email: "" });
    console.log(user);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.userName, email: user.email });
        } else {
            setFormData({ name: "", email: "" });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (user) {
                await axios.put(`https://api.example.com/users/${user.id}`, formData);
            } else {
                await axios.post("https://api.example.com/users", formData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleDelete = async () => {
        if (!user) return;
        try {
            await axios.delete(`https://api.example.com/users/${user.id}`);
            onSave();
            onClose();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Create User"}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            {user ? "Update" : "Create"}
                        </button>
                        {user && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
