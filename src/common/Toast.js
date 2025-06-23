import { jsx as _jsx } from "react/jsx-runtime";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { createPortal } from "react-dom";
const Toast = ({ text, showToast }) => {
    useEffect(() => {
        if (showToast) {
            toast.success(text);
        }
    }, [text, showToast]);
    return createPortal(_jsx(ToastContainer, { position: "top-center", autoClose: 3000, closeOnClick: true, theme: "light" }), document.getElementById("root") ?? document.body);
};
export default Toast;
