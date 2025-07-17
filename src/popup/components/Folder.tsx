import "./Folder.scss";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import { v4 } from "uuid";
import { useDarkMode } from "@rbnd/react-dark-mode";
import * as React from "react";
import {
  type DraggableProvided,
  type DroppableProvided,
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { reorder, getItemStyle } from "../../util/DragndropUtil";

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
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "300px",
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

  const openErrorModal = () => {
    setIsErrorModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
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

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      folders,
      result.source.index,
      result.destination.index,
    );

    chrome.storage.local.set({ ["folder"]: reorderedItems }, () => {
      setFolders(reorderedItems);
    });
  };

  const handleSubmit = () => {
    if (folderName.trim() === "") {
      return;
    }
    chrome.storage.local.get(["folder"], (result) => {
      const uuid = v4();
      const prevFolders: Folder[] = (result.folder as Folder[]) || [];
      const newFolder: Folder = { id: uuid, name: folderName };
      if (!prevFolders.some((folder) => folder.name === newFolder.name)) {
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
      } else {
        openErrorModal();
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
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="folder-list">
          {(provided: DroppableProvided) => (
            <div
              className="folder-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {folders.map((folder, index) => (
                <Draggable
                  key={folder.id}
                  draggableId={folder.id}
                  index={index}
                >
                  {(provided: DraggableProvided, snapshot) => (
                    <div
                      className="draggableDiv"
                      onClick={() => openModal(folder)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                      )}
                    >
                      {folder.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal
        isOpen={isErrorModalOpen}
        onRequestClose={closeErrorModal}
        style={customStyles}
      >
        <div className="modal-wrapper">
          <div className="modal-error-title">
            {chrome.i18n.getMessage("FolderNameDuplicate")}
          </div>
          <button className="modal-button" onClick={closeErrorModal}>
            {chrome.i18n.getMessage("HomeModalButton")}
          </button>
        </div>
      </Modal>
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
