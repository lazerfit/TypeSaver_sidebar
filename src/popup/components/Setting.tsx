import "./Setting.scss";
import { useDarkMode, type Mode } from "@rbnd/react-dark-mode";
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
      if (result.themeMode) setMode(result.themeMode as Mode);
    });
  }, [setMode]);

  const handleChange = async (e: string) => {
    const mode = e as Mode;
    setMode(mode);
    await chrome.storage.sync.set({ themeMode: mode });
  };

  return (
    <div className="wrapper">
      <div className="select-wrapper">
        <select
          className="setting-dark-mode-select"
          onChange={(e) => void handleChange(e.target.value)}
        >
          <option
            className="dark-mode-item"
            value="dark"
            selected={mode === "dark"}
          >
            {chrome.i18n.getMessage("ThemeDark")}
          </option>
          <option
            className="dark-mode-item"
            value="light"
            selected={mode === "light"}
          >
            {chrome.i18n.getMessage("ThemeLight")}
          </option>
        </select>
        <IoIosArrowDown className="select-arrow" />
      </div>
      <div className="setting-about-wrapper">
        <button className="setting-about-btn" onClick={openModal}>
          <div className="setting-about-btn-inner">
            <CiCircleInfo className="setting-about-icon" />
            <div>About</div>
          </div>
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="modal-setting-about-wrapper">
          <img src={icon} alt="logo" />
          <div className="modal-setting-description">
            <div className="modal-setting-about-title">TypeSaver</div>
            <div className="modal-setting-about-text">@lazerfit. 2025-2025</div>
            <div className="modal-setting-about-text">버전: 1.0.0</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Setting;
