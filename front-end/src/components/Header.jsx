import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../store/userSlice";
import useToast from "../hooks/useToast";
import { Link, useNavigate } from "react-router-dom";
import useFetchApi from "../hooks/useFetchApi";
const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showToast = useToast();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userData = useSelector((state) => state?.user);
    const authToken = localStorage.getItem('authToken');

    // const response = useFetchApi('http://localhost:5000/api/v1/users/get-user', 'GET')
    // console.log(response);

    // dispatch(addUser(response.data.data));

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

            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-indigo-800">HK.</h1>
            </div>

            <ul className="flex space-x-4">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>

            {/* Profile image and dropdown on the right */}
            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className="flex items-center focus:outline-none"
                >

                    <img src="https://img.icons8.com/fluency/48/test-account--v1.png" className="h-8 w-8 rounded-full" alt="test-account--v1" />

                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 transition-all duration-300 ${isDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                        }`}
                    >
                        <ul className="flex flex-col">
                            <Link to="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Profile
                            </Link>
                            <Link to="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Settings
                            </Link>
                            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                                Logout
                            </div>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;