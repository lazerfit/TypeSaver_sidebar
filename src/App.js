import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./App.css";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import Home from "./popup/components/Home";
import Setting from "./popup/components/Setting";
import Vault from "./popup/components/Vault";
import Layout from "./popup/components/layout/Layout";
import Folder from "./popup/components/Folder";
import { DarkModeProvider } from "@rbnd/react-dark-mode";
function App() {
    return (_jsx(DarkModeProvider, { children: _jsx(MemoryRouter, { children: _jsx("div", { className: "app-content-wrapper", children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "/vault", element: _jsx(Vault, {}) }), _jsx(Route, { path: "/setting", element: _jsx(Setting, {}) }), _jsx(Route, { path: "/folder", element: _jsx(Folder, {}) })] }) }) }) }) }));
}
export default App;
