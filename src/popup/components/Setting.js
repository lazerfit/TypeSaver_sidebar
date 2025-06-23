import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Setting.scss";
import { useDarkMode } from "@rbnd/react-dark-mode";
import { useEffect } from "react";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import { CiCircleInfo } from "react-icons/ci";
import icon from "../../assets/icon128.png";
import { IoIosArrowDown } from "react-icons/io";
const Setting = () => {
    const { mode, setMode } = useDarkMode();
    const { isModalOpen, openModal, closeModal } = useModal();
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            height: "390px",
            backgroundColor: mode === "dark" ? "#262626" : "#F8F7F4",
        },
    };
    useEffect(() => {
        chrome.storage.sync.get("themeMode", (result) => {
            if (result.themeMode)
                setMode(result.themeMode);
        });
    }, [setMode]);
    const handleChange = async (e) => {
        const mode = e;
        setMode(mode);
        await chrome.storage.sync.set({ themeMode: mode });
    };
    return (_jsxs("div", { className: "wrapper", children: [_jsxs("div", { className: "select-wrapper", children: [_jsxs("select", { className: "setting-dark-mode-select", onChange: (e) => void handleChange(e.target.value), children: [_jsx("option", { className: "dark-mode-item", value: "dark", selected: mode === "dark", children: chrome.i18n.getMessage("ThemeDark") }), _jsx("option", { className: "dark-mode-item", value: "light", selected: mode === "light", children: chrome.i18n.getMessage("ThemeLight") })] }), _jsx(IoIosArrowDown, { className: "select-arrow" })] }), _jsx("div", { className: "setting-about-wrapper", children: _jsx("button", { className: "setting-about-btn", onClick: openModal, children: _jsxs("div", { className: "setting-about-btn-inner", children: [_jsx(CiCircleInfo, { className: "setting-about-icon" }), _jsx("div", { children: "About" })] }) }) }), _jsx(Modal, { isOpen: isModalOpen, onRequestClose: closeModal, style: customStyles, children: _jsxs("div", { className: "modal-setting-about-wrapper", children: [_jsx("img", { src: icon, alt: "logo" }), _jsxs("div", { className: "modal-setting-description", children: [_jsx("div", { className: "modal-setting-about-title", children: "TypeSaver" }), _jsx("div", { className: "modal-setting-about-text", children: "@lazerfit. 2025-2025" }), _jsx("div", { className: "modal-setting-about-text", children: "\uBC84\uC804: 1.0.0" })] })] }) })] }));
};
export default Setting;
