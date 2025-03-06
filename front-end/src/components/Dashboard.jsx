import { useDispatch, useSelector } from 'react-redux';
import { addAllUser } from '../store/userSlice';
import useToast from '../hooks/useToast';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserModal from './userModal';
import { OPTIONS as options } from '../utils/constants';
const Dashboard = () => {
    const { currentUser, allUser } = useSelector((state) => state?.user);
    console.log(currentUser);
    console.log(allUser);

    const dispatch = useDispatch();
    const showToast = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);

    useEffect(() => {
        userData?.length === 0 && fetchData();
    }, [userData, dispatch, showToast]); // Dependencies ensure this runs when needed

    const fetchData = async () => {
        const responseData = await axios.get('http://localhost:5000/api/v1/users/all-users', options);
        dispatch(addAllUser(responseData?.data?.data)); // ✅ State update happens after render
        showToast(responseData?.data?.message, "success"); // ✅ Toast after render
    };

    const handleDelete = async (user_id) => {
        if (!user_id) return;
        try {
            let responseData = await axios.delete(`http://localhost:5000/api/v1/users/delete-user/${user_id}`, options);
            showToast(responseData?.data?.message, "success");
            fetchData();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


    return (
        <div>
            <div className="flex items-center justify-around flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 h-full">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full px-32 py-10 ">
                    {/* search section */}
                    <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                        <button className="block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={() => { setSelectedUser(null); setModalOpen(true); }}>
                            Add User
                        </button>
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                        </div>
                    </div>

                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    Sno
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Position
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" colSpan={2} className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {Array.isArray(userData) ?
                                (userData?.map((user, index) => {
                                    return (
                                        <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="w-4 p-4">
                                                <span> {index + 1} </span>
                                            </td>
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <img className="w-10 h-10 rounded-full" src={user.avatar ? user.avatar : "https://flowbite.com/docs/images/people/profile-picture-3.jpg"} alt="Jese image" />
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold"> {user?.userName} </div>
                                                    <div className="font-normal text-gray-500">{user?.email}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                {user.fullName}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={"h-2.5 w-2.5 rounded-full me-2 " + (user.avatar ? "bg-green-500" : "bg-red-500")}></div> {user.avatar ? "Active" : "Inactive"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => { setSelectedUser(userData[index]); setModalOpen(true); }} className="font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md text-sm px-5 py-2.5 text-center light:text-blue-500">Edit</button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleDelete(user._id)} className="font-medium text-white bg-red-700 hover:bg-red-800 rounded-md text-sm px-5 py-2.5 text-center light:text-blue-500">Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                ) : (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td colSpan={5} className="p-4 text-center">
                                            <span> No data found! </span>
                                        </td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                user={selectedUser}
                onSave={fetchData}
            />
        </div>
    )
}

export default Dashboard