import { useState, useEffect } from "react";
import "./Home.scss";
import * as React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { v4 } from "uuid";
import Toast from "../../common/Toast";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import type { Folder } from "./Folder.tsx";
import { useDarkMode } from "@rbnd/react-dark-mode";

Modal.setAppElement("#root");

export interface Snippet {
  id: string;
  folder: string;
  title: string;
  text: string;
}

const Home = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("default");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [toastText, setToastText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { isModalOpen, openModal, closeModal } = useModal();
  const { mode } = useDarkMode();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "290px",
      height: "150px",
      backgroundColor: mode === "dark" ? "#262626" : "#F8F7F4",
      borderRadius: "10px",
    },
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(event.target.value);
  };

  const handleSubmit = () => {
    if (!title || !text) {
      openModal();
      return;
    }
    chrome.storage.local.get([selectedFolder], (result) => {
      const prevSnippets: Snippet[] =
        (result[selectedFolder] as Snippet[]) ?? [];
      const uuid = v4();
      const newSnippets = [
        ...prevSnippets,
        { id: uuid, folder: selectedFolder, title, text },
      ];
      chrome.storage.local
        .set({ [selectedFolder]: newSnippets })
        .then(() => {
          setTitle("");
          setText("");
          setSelectedFolder("");
          setToastText(chrome.i18n.getMessage("ToastSnippetSave"));
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 100);
        })
        .catch((e) => console.log(e));
    });
  };

  useEffect(() => {
    chrome.storage.local.get(["folder"], (result) => {
      const storedFolders: Folder[] = (result.folder as Folder[]) ?? [];
      setFolders(storedFolders);
    });
  });

  return (
    <div className="wrapper">
      <div className="content-wrapper">
        <div className="select-wrapper">
          <select
            className="folder-select"
            name="폴더"
            value={selectedFolder}
            onChange={handleFolderChange}
          >
            <option value="default">
              {chrome.i18n.getMessage("SelectOptionDefault")}
            </option>
            {folders.map((folder) => {
              return (
                <option key={folder.id} value={folder.name}>
                  {folder.name}
                </option>
              );
            })}
          </select>
          <IoIosArrowDown className="select-arrow" />
        </div>
        <input
          className="title-input"
          type="text"
          placeholder={chrome.i18n.getMessage("HomeInputPlaceholder")}
          value={title}
          onChange={handleTitleChange}
        />
        <textarea
          className="text-input"
          placeholder={chrome.i18n.getMessage("HomeTextareaPlaceholder")}
          value={text}
          onChange={handleTextChange}
        />
        <button className="save-button" onClick={handleSubmit}>
          <span>{chrome.i18n.getMessage("HomeSaveButton")}</span>
        </button>
      </div>
      <Toast text={toastText} showToast={showToast} />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="modal-wrapper">
          <h2>{chrome.i18n.getMessage("HomeModalTitle")}</h2>
          <button className="modal-button" onClick={closeModal}>
            {chrome.i18n.getMessage("HomeModalButton")}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
