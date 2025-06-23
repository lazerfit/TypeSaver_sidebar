import "./Footer.scss";
import { useNavigate } from "react-router-dom";
import { CiSettings, CiHome, CiVault, CiFolderOn } from "react-icons/ci";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="footer-content-wrapper">
        <div className="footer-content">
          <CiVault className="icon" onClick={() => void navigate("/vault")} />
          <CiHome className="icon" onClick={() => void navigate("/")} />
          <CiFolderOn
            className="icon"
            onClick={() => void navigate("/folder")}
          />
          <CiSettings
            className="icon"
            onClick={() => void navigate("/setting")}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
