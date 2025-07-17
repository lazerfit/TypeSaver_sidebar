import "./Footer.scss";
import { useNavigate } from "react-router-dom";
import {
  CiSettings,
  CiHome,
  CiVault,
  CiFolderOn,
  CiStar,
} from "react-icons/ci";

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
          <CiStar className="icon" onClick={() => void navigate("/favorite")} />
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
