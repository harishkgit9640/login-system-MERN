import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice'
import useFetchApi from '../hooks/useFetchApi';
import useFormData from '../hooks/useFormData';
const Login = () => {
    const navigate = useNavigate();
    const showToast = useToast();
    const dispatch = useDispatch();
    const [isLogInForm, setIsLogInForm] = useState(false)
    const { FormData, handleInput, resetFormData } = useFormData({
        userName: '',
        fullName: '',
        email: '',
        password: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        resetFormData();
        const data = {
            userName: FormData.userName,
            fullName: FormData.fullName,
            email: FormData.email,
            password: FormData.password,
        }
        const response = useFetchApi('http://localhost:5000/api/v1/users/login', 'POST', data)
        console.log(response);

        return false;

        if (response.data.statusCode === 200) {
            // Store the token in localStorage or sessionStorage
            localStorage.setItem('authToken', response.data.data.accessToken);

            // Dispatch the user data to your state management (e.g., Redux)
            dispatch(addUser(response.data.data));

            // Show a success message
            showToast(response.data.message, "success");

            // Redirect the user to the home page or dashboard
            navigate("/");
        } else {
            showToast(response.data.message, "error");
        }

    };


    return (
        <>
            <div className='w-screen h-screen bg-gradient-to-t from-slate-900 to-slate-700 grid place-items-center'>
                <form className="w-full max-w-sm bg-slate-300 p-4 rounded-md shadow-sm shadow-slate-300" onSubmit={handleSubmit}>
                    <h1 className="font-bold text-2xl text-center">{isLogInForm ? "Login" : "Register"}</h1>
                    {!isLogInForm &&
                        (<>
                            <div className="input-item">
                                <label htmlFor="fullName" className='py-2 block font-bold'>Full Name</label>
                                <input type="text" name='fullName' className='px-4 py-2 bg-slate-600 text-white outline-none rounded-sm w-full' onChange={handleInput} value={FormData.fullName} placeholder='Full Name' />
                            </div>
                            <div className="input-item">
                                <label htmlFor="Username" className='py-2 block font-bold'>User Name</label>
                                <input type="text" name='userName' className='px-4 py-2 bg-slate-600 text-white outline-none rounded-sm w-full' onChange={handleInput} value={FormData.userName} placeholder='User Name' />
                            </div>
                        </>)
                    }
                    <div className="input-item">
                        <label htmlFor="Email" className='py-2 block font-bold'>E-mail</label>
                        <input type="email" name='email' className='px-4 py-2 bg-slate-600 text-white outline-none rounded-sm w-full' onChange={handleInput} value={FormData.email} placeholder='Email' />
                    </div>
                    <div className="input-item">
                        <label htmlFor="Password" className='py-2 block font-bold'>Password</label>
                        <input type="password" name='password' className='px-4 py-2 bg-slate-600 text-white outline-none rounded-sm w-full' onChange={handleInput} value={FormData.password} placeholder='Password' />
                    </div>

                    <button type='submit' className='px-6 py-2 my-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md outline-none cursor-pointer'> {isLogInForm ? "Login" : "Register"} </button>
                    <p className="text-sm"> {!isLogInForm ? "Already have an account? " : "Don't have an account? "} <span onClick={() => setIsLogInForm(!isLogInForm)} className='text-indigo-600 cursor-pointer'> {isLogInForm ? "Register" : "Login"} </span></p>
                </form>
            </div>
        </>
    )
}

export default Login