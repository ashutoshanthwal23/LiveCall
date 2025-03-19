import { ToastContainer, toast } from 'react-toastify';

export const ToastContainerWrapper = () => {
    return <ToastContainer
    position="top-center"
    autoClose={500}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    />
}

export const ToastSuccess = (msg) => {
    toast.success(msg, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
}

export const ToastError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
}