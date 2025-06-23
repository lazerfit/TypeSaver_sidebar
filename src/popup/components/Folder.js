import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Folder.scss";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import { v4 } from "uuid";
import { useDarkMode } from "@rbnd/react-dark-mode";
Modal.setAppElement("#root");
const Folder = () => {
    const [folderName, setFolderName] = useState("");
    const [folders, setFolders] = useState([
        { id: "default", name: "기본 폴더" },
    ]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const { isModalOpen, openModal: modalOpen, closeModal: modalClose, } = useModal();
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
            const storedFolders = result.folder ?? [];
            setFolders(storedFolders);
        });
    }, []);
    const openModal = (folder) => {
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
    const handleInputChange = (event) => {
        setFolderName(event.target.value);
    };
    const handeEditModeClose = () => {
        setIsEditMode(false);
    };
    const handleNewFolderNameChange = (event) => {
        setNewFolderName(event.target.value);
    };
    const handleSubmit = () => {
        if (folderName.trim() === "") {
            return;
        }
        chrome.storage.local.get(["folder"], (result) => {
            const uuid = v4();
            const prevFolders = result.folder || [];
            const newFolder = { id: uuid, name: folderName };
            if (!prevFolders.includes(newFolder)) {
                prevFolders.push(newFolder);
                chrome.storage.local
                    .set({ ["folder"]: prevFolders })
                    .then(() => {
                    setFolderName("");
                    chrome.storage.local.get(["folder"], (res) => {
                        const updatedFolders = res.folder || [];
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
            const prevFolders = result.folder || [];
            const updatedFolders = prevFolders.map((folder) => folder.id === selectedFolder.id
                ? { ...folder, name: newFolderName }
                : folder);
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
    const handleDeleteFolder = (id) => {
        if (!window.confirm(chrome.i18n.getMessage("FolderDeleteConfirm"))) {
            return;
        }
        chrome.storage.local.get(["folder"], (result) => {
            const folder = result.folder ?? [];
            const updatedFolder = folder.filter((s) => s.id !== id);
            chrome.storage.local.set({ ["folder"]: updatedFolder }, () => {
                setFolders(updatedFolder);
                closeModal();
            });
        });
    };
    return (_jsxs("div", { className: "wrapper", children: [_jsxs("div", { className: "input-wrapper", children: [_jsx("input", { type: "text", className: "folder-input", placeholder: chrome.i18n.getMessage("FolderInputPlaceholder"), value: folderName, onChange: handleInputChange }), _jsx("button", { className: "folder-input-button", onClick: handleSubmit, children: "Add" })] }), _jsx("div", { className: "folder-list", children: folders.map((folder, index) => (_jsx("button", { className: "list-item", onClick: () => openModal(folder), children: folder.name }, index))) }), _jsx(Modal, { isOpen: isModalOpen, onRequestClose: closeModal, style: customStyles, children: isEditMode ? (_jsxs("div", { className: "modal-wrapper", children: [_jsx("input", { type: "text", className: "modal-input", value: newFolderName, onChange: handleNewFolderNameChange }), _jsxs("div", { className: "modal-button-wrapper", children: [_jsx("button", { onClick: handleSubmitEditedFolderName, children: chrome.i18n.getMessage("HomeSaveButton") }), _jsx("button", { onClick: handeEditModeClose, children: chrome.i18n.getMessage("Cancel") })] })] })) : (_jsxs("div", { className: "modal-wrapper", children: [_jsx("div", { className: "modal-title", children: selectedFolder?.name }), _jsxs("div", { className: "modal-button-wrapper", children: [_jsx("button", { onClick: () => handleDeleteFolder(selectedFolder?.id ?? ""), children: chrome.i18n.getMessage("Delete") }), _jsx("button", { onClick: handleEditClick, children: chrome.i18n.getMessage("Modify") })] })] })) })] }));
};
export default Folder;
