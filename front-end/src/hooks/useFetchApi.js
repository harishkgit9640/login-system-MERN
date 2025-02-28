import { useEffect, useState } from 'react';
import axios from 'axios';
import useToast from './useToast';

const useFetchApi = (url, method, data = null) => {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const showToast = useToast();
    const authToken = localStorage.getItem('authToken');
    console.log(authToken);

    const options = {
        headers: {
            "Authorization": `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
    };

    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let response;
                switch (method) {
                    case 'GET':
                        response = await axios.get(url, { ...options, cancelToken: source.token });
                        break;
                    case 'POST':
                        response = await axios.post(url, data, { ...options, cancelToken: source.token });
                        break;
                    default:
                        throw new Error(`Unsupported method: ${method}`);
                }

                setResponseData(response.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Error:", error);
                    setError(error);
                    showToast(error.response?.data?.message || "Something went wrong", "error");
                }
            } finally {
                setLoading(false);
            }
        };

        if (url !== undefined && method !== undefined) {
            fetchData();
        }

        // Cleanup function to cancel the request
        return () => {
            source.cancel("Component unmounted, request canceled");
        };
    }, [url, method, data]); // Re-fetch if any of these dependencies change

    return { responseData, loading, error };
};

export default useFetchApi;