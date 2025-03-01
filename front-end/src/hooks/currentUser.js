import { useSelector } from "react-redux";
import useFetchApi from "./useFetchApi";

const userData = useSelector((state) => state?.user);
const authToken = localStorage.getItem('authToken');
console.log(userData);


if (!userData && authToken) {
    const response = useFetchApi('http://localhost:5000/api/v1/users/get-user', 'GET', null)
    console.log(response);
    dispatch(addUser(response.data.data));
}
