import "./Folder.scss";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import { v4 } from "uuid";
import { useDarkMode } from "@rbnd/react-dark-mode";

Modal.setAppElement("#root");

export interface Folder {
  id: string;
  name: string;
}

const Folder = () => {
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState<Folder[]>([
    { id: "default", name: "기본 폴더" },
  ]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const {
    isModalOpen,
    openModal: modalOpen,
    closeModal: modalClose,
  } = useModal();
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
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
      height: "130px",
      backgroundColor: mode === "dark" ? "#262626" : "#F8F7F4",
      borderRadius: "10px",
    },
  };

  useEffect(() => {
    chrome.storage.local.get(["folder"], (result) => {
      const storedFolders: Folder[] = (result.folder as Folder[]) ?? [];
      setFolders(storedFolders);
    });
  }, []);

  const openModal = (folder: Folder) => {
    modalOpen();
    setSelectedFolder(folder);
  };

  const closeModal = () => {
    modalClose();
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setNewFolderName(selectedFolder?.name ?? "");
    setIsEditMode(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handeEditModeClose = () => {
    setIsEditMode(false);
  };

  const handleNewFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewFolderName(event.target.value);
  };

  const handleSubmit = () => {
    if (folderName.trim() === "") {
      return;
    }
    chrome.storage.local.get(["folder"], (result) => {
      const uuid = v4();
      const prevFolders: Folder[] = (result.folder as Folder[]) || [];
      const newFolder: Folder = { id: uuid, name: folderName };
      if (!prevFolders.includes(newFolder)) {
        prevFolders.push(newFolder);
        chrome.storage.local
          .set({ ["folder"]: prevFolders })
          .then(() => {
            setFolderName("");
            chrome.storage.local.get(["folder"], (res) => {
              const updatedFolders: Folder[] = (res.folder as Folder[]) || [];
              setFolders(updatedFolders);
            });
          })
          .catch((e) => console.log(e));
      }
    });
  };

  const handleSubmitEditedFolderName = () => {
    if (newFolderName.trim() === "" || !selectedFolder) {
      return;
    }
    chrome.storage.local.get(["folder"], (result) => {
      const prevFolders: Folder[] = (result.folder as Folder[]) || [];
      const updatedFolders = prevFolders.map((folder) =>
        folder.id === selectedFolder.id
          ? { ...folder, name: newFolderName }
          : folder,
      );
      chrome.storage.local
        .set({ ["folder"]: updatedFolders })
        .then(() => {
          setFolders(updatedFolders);
          setIsEditMode(false);
          setNewFolderName("");
          setSelectedFolder(null);
          closeModal();
        })
        .catch((e) => console.log(e));
    });
  };

  const handleDeleteFolder = (id: string) => {
    if (!window.confirm(chrome.i18n.getMessage("FolderDeleteConfirm"))) {
      return;
    }
    chrome.storage.local.get(["folder"], (result) => {
      const folder: Folder[] = (result.folder as Folder[]) ?? [];
      const updatedFolder = folder.filter((s) => s.id !== id);
      chrome.storage.local.set({ ["folder"]: updatedFolder }, () => {
        setFolders(updatedFolder);
        closeModal();
      });
    });
  };

  return (
    <div className="wrapper">
      <div className="input-wrapper">
        <input
          type="text"
          className="folder-input"
          placeholder={chrome.i18n.getMessage("FolderInputPlaceholder")}
          value={folderName}
          onChange={handleInputChange}
        />
        <button className="folder-input-button" onClick={handleSubmit}>
          Add
        </button>
      </div>
      <div className="folder-list">
        {folders.map((folder, index) => (
          <button
            key={index}
            className="list-item"
            onClick={() => openModal(folder)}
          >
            {folder.name}
          </button>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {isEditMode ? (
          <div className="modal-wrapper">
            <input
              type="text"
              className="modal-input"
              value={newFolderName}
              onChange={handleNewFolderNameChange}
            ></input>
            <div className="modal-button-wrapper">
              <button onClick={handleSubmitEditedFolderName}>
                {chrome.i18n.getMessage("HomeSaveButton")}
              </button>
              <button onClick={handeEditModeClose}>
                {chrome.i18n.getMessage("Cancel")}
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-wrapper">
            <div className="modal-title">{selectedFolder?.name}</div>
            <div className="modal-button-wrapper">
              <button
                onClick={() => handleDeleteFolder(selectedFolder?.id ?? "")}
              >
                {chrome.i18n.getMessage("Delete")}
              </button>
              <button onClick={handleEditClick}>
                {chrome.i18n.getMessage("Modify")}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Folder;
