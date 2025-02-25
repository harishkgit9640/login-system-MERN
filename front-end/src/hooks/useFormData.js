import { useState } from "react"

const useFormData = (initialState) => {
    const [value, setValue] = useState(initialState);

    const handleInput = (e) => {
        setValue((pre) => ({ ...pre, [e.target.name]: e.target.value }));
    };

    const resetFormData = () => {
        setValue(initialState);
    };

    return { value, handleInput, resetFormData }

}
export default useFormData