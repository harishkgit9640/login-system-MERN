import { toast } from "react-toastify";

const useToast = () => {
    return (message, type = "info") => {
        const options = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        };

        switch (type) {
            case "success":
                toast.success(message, options);
                break;
            case "error":
                toast.error(message, options);
                break;
            case "warning":
                toast.warning(message, options);
                break;
            case "info":
            default:
                toast.info(message, options);
                break;
        }
    };
};

export default useToast;
