import { useState, useEffect } from "react";
import axios from "axios";
import useToast from "../hooks/useToast";
import { OPTIONS } from '../utils/constants';
const UserModal = ({ isOpen, onClose, user, onSave }) => {
    const showToast = useToast();
    const [formData, setFormData] = useState({ fullName: "", userName: "", email: "", password: "" });
    // console.log(" user modal => ", user._id);

    useEffect(() => {
        if (user) {
            setFormData({ fullName: user.fullName, userName: user.userName, email: user.email });
        } else {
            setFormData({ fullName: "", userName: "", email: "", password: "" });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData => ", formData);

        let responseData;
        try {
            if (user) {
                responseData = await axios.patch(`http://localhost:5000/api/v1/users/update-account`, formData, OPTIONS);
            } else {
                responseData = await axios.post("http://localhost:5000/api/v1/users/register", formData);
            }
            showToast(responseData?.data?.message, "success");
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving user:", error);
            showToast(error.response?.data?.message, "error");
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
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <input
                        type="text"
                        name="userName"
                        placeholder="User Name"
                        value={formData.userName}
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
                    {!user && (

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-2"
                            required
                        />
                    )}
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            {user ? "Update" : "Create"}
                        </button>

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
