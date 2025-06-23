import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Footer.scss";
import { useNavigate } from "react-router-dom";
import { CiSettings, CiHome, CiVault, CiFolderOn } from "react-icons/ci";
const Footer = () => {
    const navigate = useNavigate();
    return (_jsx("footer", { children: _jsx("div", { className: "footer-content-wrapper", children: _jsxs("div", { className: "footer-content", children: [_jsx(CiVault, { className: "icon", onClick: () => void navigate("/vault") }), _jsx(CiHome, { className: "icon", onClick: () => void navigate("/") }), _jsx(CiFolderOn, { className: "icon", onClick: () => void navigate("/folder") }), _jsx(CiSettings, { className: "icon", onClick: () => void navigate("/setting") })] }) }) }));
};
export default Footer;
