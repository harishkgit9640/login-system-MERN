const authToken = localStorage.getItem('authToken');
export const OPTIONS = {
    headers: {
        "Authorization": `Bearer ${authToken}`,
        'Content-Type': 'application/json',
    },
};

export const BASE_URL = "http://localhost:5000/api/v1"
