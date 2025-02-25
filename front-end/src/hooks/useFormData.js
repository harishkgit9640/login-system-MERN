import { useState } from "react"

const useFormData = (initialState) => {
    const [data, setData] = useState(initialState);

    const handleInput = (e) => {
        setData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
    };

    const resetFormData = () => {
        setData(initialState);
    };

    return { data, handleInput, resetFormData }

}
export default useFormData