import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  text: string;
  showToast: boolean;
}

const Toast = ({ text, showToast }: Props) => {
  useEffect(() => {
    if (showToast) {
      toast.success(text);
    }
  }, [text, showToast]);

  return createPortal(
    <ToastContainer
      position="top-center"
      autoClose={3000}
      closeOnClick={true}
      theme="light"
    />,
    document.getElementById("root") ?? document.body,
  );
};

export default Toast;
