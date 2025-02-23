import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../store/userSlice";
import useToast from "../hooks/useToast";
const Header = () => {
    const dispatch = useDispatch();
    const showToast = useToast();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userData = useSelector((state) => state?.user);
    const authToken = localStorage.getItem('authToken');
    useEffect(() => {
        if (authToken) {
            // Fetch user details using the token
            const fetchUser = async () => {
                try {
                    const response = await axios.get(
                        "http://localhost:5000/api/v1/users/get-user",

                        {
                            headers: {
                                "Authorization": `Bearer ${authToken}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    // Dispatch the user data to your state management (e.g., Redux)
                    dispatch(addUser(response.data.data));
                } catch (error) {
                    console.error("Error fetching user details:", error);
                    // If the token is invalid, clear it from storage
                    localStorage.removeItem('authToken');
                }
            };
            fetchUser();
        }

    }, [dispatch]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        localStorage.removeItem('authToken');
        dispatch(removeUser());
        showToast("Logged out successfully!", "success");
        navigate("/login");
    };

    return (
        <header className="flex items-center justify-between px-5 md:px-10 p-4 bg-white shadow-md">
            {/* Logo on the left */}
            <div className="flex items-center">
                <img
                    src='./working' // Replace with your logo path
                    alt="Logo"
                    className="h-8"
                />
            </div>

            <ul className="flex space-x-4">
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>

            {/* Profile image and dropdown on the right */}
            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className="flex items-center focus:outline-none"
                >
                    <img
                        src='./working' // Replace with your profile image path
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                    />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 transition-all duration-300 ${isDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                        }`}
                    >
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profile
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Settings
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;