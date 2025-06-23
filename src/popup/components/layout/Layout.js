import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Header from "./Header";
import Footer from "./Footer";
import { useOutlet } from "react-router-dom";
import "./Layout.scss";
const Layout = () => {
    const outlet = useOutlet();
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { children: outlet }), _jsx(Footer, {})] }));
};
export default Layout;
