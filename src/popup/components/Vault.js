import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "./Vault.scss";
import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import Modal from "react-modal";
import { useModal } from "../../hooks/useModal";
import { useDarkMode } from "@rbnd/react-dark-mode";
import { IoCopyOutline } from "react-icons/io5";
import { CiStar } from "react-icons/ci";
import { TiStarFullOutline } from "react-icons/ti";
import { handleCopyText } from "../../util/CommonUtils";
import { DragDropContext, Droppable, Draggable, } from "@hello-pangea/dnd";
import { reorder, getItemStyle } from "../../util/DragndropUtil";
import * as React from "react";
Modal.setAppElement("#root");
const Vault = () => {
    const [folderList, setFolderList] = useState([]);
    const [folderName, setFolderName] = useState("default");
    const [snippetsByFolder, setSnippetsByFolder] = useState([]);
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [snippetText, setSnippetText] = useState("");
    const [snippetTitle, setSnippetTitle] = useState("");
    const { isModalOpen, openModal: modalOpen, closeModal: modalClose, } = useModal();
    const { mode } = useDarkMode();
    const [shouldFavoriteRefetch, setShouldFavoriteRefetch] = useState(false);
    const [favoriteSnippets, setFavoriteSnippets] = useState([]);
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            borderRadius: "10px",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            height: "390px",
            backgroundColor: mode === "dark" ? "#262626" : "#F8F7F4",
        },
    };
    const openModal = (snippet) => {
        modalOpen();
        setSelectedSnippet(snippet);
    };
    const closeModal = () => {
        modalClose();
        setIsEditMode(false);
    };
    const handleEditClick = (title, text) => {
        setIsEditMode(true);
        setSnippetText(text);
        setSnippetTitle(title);
    };
    const handleSubmit = () => {
        if (snippetTitle.trim() === "" ||
            snippetText.trim() === "" ||
            !selectedSnippet)
            return;
        else {
            const updatedSnippet = {
                ...selectedSnippet,
                title: snippetTitle.trim(),
                text: snippetText.trim(),
            };
            chrome.storage.local.get([folderName], (result) => {
                const folder = result[folderName] ?? [];
                const updatedFolder = folder.map((s) => s.id === selectedSnippet?.id ? updatedSnippet : s);
                chrome.storage.local.set({ [folderName]: updatedFolder }, () => {
                    setSnippetsByFolder(updatedFolder);
                    closeModal();
                    setSelectedSnippet(null);
                    setIsEditMode(false);
                    setSnippetText("");
                    setSnippetTitle("");
                });
            });
        }
    };
    const handleOnChangeTitle = (event) => {
        setSnippetTitle(event.target.value);
    };
    const handleOnChangeText = (event) => {
        setSnippetText(event.target.value);
    };
    const handleCloseEditMode = () => {
        setIsEditMode(false);
    };
    const handleDeleteSnippet = (id) => {
        if (!window.confirm(chrome.i18n.getMessage("VaultSnippetDeleteConfirm"))) {
            return;
        }
        chrome.storage.local.get([folderName], (result) => {
            const folder = result[folderName] ?? [];
            const updatedFolder = folder.filter((s) => s.id !== id);
            chrome.storage.local.set({ [folderName]: updatedFolder }, () => {
                setSnippetsByFolder(updatedFolder);
                closeModal();
            });
        });
    };
    const handleOnDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const reorderedItems = reorder(snippetsByFolder, result.source.index, result.destination.index);
        chrome.storage.local.set({ [folderName]: reorderedItems }, () => {
            setSnippetsByFolder(reorderedItems);
        });
    };
    const handleSaveFavoriteSnippet = (snippet) => {
        if (favoriteSnippets.some((s) => s.id === snippet.id))
            return;
        const updatedSnippet = { ...snippet, folder: "favoriteSnippets" };
        const updatedFavoriteSnippets = [...favoriteSnippets, updatedSnippet];
        chrome.storage.local.set({ favoriteSnippets: updatedFavoriteSnippets }, () => {
            setFavoriteSnippets(updatedFavoriteSnippets);
            setShouldFavoriteRefetch(true);
        });
    };
    const handleRemoveFavoriteSnippet = (snippet) => {
        const updatedFavoriteSnippets = favoriteSnippets.filter((s) => s.id !== snippet.id);
        chrome.storage.local.set({ favoriteSnippets: updatedFavoriteSnippets }, () => {
            setFavoriteSnippets(updatedFavoriteSnippets);
            setShouldFavoriteRefetch(true);
        });
    };
    useEffect(() => {
        chrome.storage.local.get("folder", (result) => {
            setFolderList(result.folder ?? []);
        });
    }, []);
    useEffect(() => {
        chrome.storage.local.get([folderName], (result) => {
            setSnippetsByFolder(result[folderName] ?? []);
        });
    }, [folderName]);
    useEffect(() => {
        if (shouldFavoriteRefetch) {
            chrome.storage.local.get(["favoriteSnippets"], (result) => {
                setFavoriteSnippets(result.favoriteSnippets ?? []);
                setShouldFavoriteRefetch(false);
            });
        }
    }, [shouldFavoriteRefetch]);
    useEffect(() => {
        chrome.storage.local.get(["favoriteSnippets"], (result) => {
            setFavoriteSnippets(result.favoriteSnippets ?? []);
        });
    }, []);
    return (_jsxs("div", { className: "wrapper", children: [_jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "select-wrapper", children: [_jsxs("select", { className: "vault-select", value: folderName, onChange: (e) => setFolderName(e.target.value), children: [_jsx("option", { value: "default", children: chrome.i18n.getMessage("SelectOptionDefault") }), folderList.map((folder) => {
                                        return (_jsx("option", { value: folder.name, children: folder.name }, folder.id));
                                    })] }), _jsx(IoIosArrowDown, { className: "select-arrow" })] }), _jsx(DragDropContext, { onDragEnd: handleOnDragEnd, children: _jsx(Droppable, { droppableId: "snippet-list-wrapper", children: (provided) => (_jsx(_Fragment, { children: _jsxs("div", { className: "snippet-list-wrapper", ...provided.droppableProps, ref: provided.innerRef, children: [snippetsByFolder.map((snippet, index) => (_jsx(Draggable, { draggableId: snippet.id, index: index, children: (provided, snapshot) => (_jsx(_Fragment, { children: _jsxs("div", { className: "draggableDiv", onClick: () => openModal(snippet), ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, style: getItemStyle(snapshot.isDragging, provided.draggableProps.style), children: [_jsx("div", { className: "snippet-title", children: snippet.title }), _jsx("button", { className: "favorite-snippets-save-button", tabIndex: 1, onClick: (e) => {
                                                                e.stopPropagation();
                                                                handleSaveFavoriteSnippet(snippet);
                                                            }, children: favoriteSnippets.some((s) => s.id === snippet.id) ? (_jsx(TiStarFullOutline, { className: "favorite-snippets-header-icon", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveFavoriteSnippet(snippet);
                                                                } })) : (_jsx(CiStar, { className: "favorite-snippet-empty-star" })) }), _jsx("button", { type: "button", className: "snippet-item-copy-button", onClick: (e) => handleCopyText(e, snippet.text), tabIndex: 0, "aria-label": "\uBCF5\uC0AC", children: _jsx(IoCopyOutline, { className: "copy-button" }) })] }) })) }, snippet.id))), provided.placeholder] }) })) }) })] }), _jsx(Modal, { isOpen: isModalOpen, onRequestClose: closeModal, style: customStyles, children: _jsxs("div", { className: "modal-wrapper", children: [_jsx("div", { className: "back-button-wrapper", children: _jsx(IoIosArrowBack, { className: "back-button", onClick: closeModal }) }), isEditMode ? (_jsxs("div", { className: "modal-wrapper", children: [_jsx("input", { className: "modal-input", type: "text", value: snippetTitle, onChange: handleOnChangeTitle }), _jsx("textarea", { className: "modal-textarea", value: snippetText, onChange: handleOnChangeText }), _jsxs("div", { className: "modal-button-wrapper", children: [_jsx("button", { className: "modal-button", onClick: handleSubmit, children: chrome.i18n.getMessage("HomeSaveButton") }), _jsx("button", { className: "modal-button", onClick: handleCloseEditMode, children: chrome.i18n.getMessage("Cancel") })] })] })) : (_jsxs("div", { className: "modal-wrapper", children: [_jsx("div", { className: "modal-title", children: selectedSnippet?.title }), _jsx("div", { className: "modal-text", children: selectedSnippet?.text }), _jsxs("div", { className: "modal-button-wrapper", children: [_jsx("button", { className: "modal-button", onClick: () => handleDeleteSnippet(selectedSnippet?.id ?? ""), children: chrome.i18n.getMessage("Delete") }), _jsx("button", { className: "modal-button", onClick: () => handleEditClick(selectedSnippet?.title ?? "", selectedSnippet?.text ?? ""), children: chrome.i18n.getMessage("Modify") })] })] }))] }) })] }));
};
export default Vault;
