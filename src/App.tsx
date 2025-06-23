import "./App.css";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import Home from "./popup/components/Home";
import Setting from "./popup/components/Setting";
import Vault from "./popup/components/Vault";
import Layout from "./popup/components/layout/Layout";
import Folder from "./popup/components/Folder";
import { DarkModeProvider } from "@rbnd/react-dark-mode";

function App() {
  return (
    <DarkModeProvider>
      <MemoryRouter>
        <div className="app-content-wrapper">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/folder" element={<Folder />} />
            </Route>
          </Routes>
        </div>
      </MemoryRouter>
    </DarkModeProvider>
  );
}

export default App;
