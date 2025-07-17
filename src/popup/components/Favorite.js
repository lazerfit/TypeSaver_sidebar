import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DragDropContext, Draggable, Droppable, } from "@hello-pangea/dnd";
import { getItemStyle, reorder } from "../../util/DragndropUtil";
import { handleCopyText } from "../../util/CommonUtils";
import { IoCopyOutline } from "react-icons/io5";
import { PiStarFill } from "react-icons/pi";
import { useState, useEffect } from "react";
import "./Favorite.scss";
const Favorite = () => {
    const [favoriteSnippets, setFavoriteSnippets] = useState([]);
    const handleOnDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const reorderedItems = reorder(favoriteSnippets, result.source.index, result.destination.index);
        chrome.storage.local.set({ ["favoriteSnippets"]: reorderedItems }, () => {
            setFavoriteSnippets(reorderedItems);
        });
    };
    useEffect(() => {
        chrome.storage.local.get(["favoriteSnippets"], (result) => {
            const storedSnippets = result.favoriteSnippets ?? [];
            setFavoriteSnippets(storedSnippets);
        });
    }, []);
    return (_jsx("div", { className: "wrapper", children: _jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "favorite-snippets-header", children: [_jsx(PiStarFill, { className: "favorite-snippets-header-icon" }), "\uC990\uACA8\uCC3E\uAE30"] }), favoriteSnippets.length === 0 && (_jsxs("div", { className: "no-favorite-snippets-wrapper", children: [_jsx("div", { className: "no-favorite-snippets-text", children: chrome.i18n.getMessage("favoriteSnippetText1") }), _jsxs("div", { className: "no-favorite-snippets-hotkey", children: [_jsx("div", { className: "hotkey-button", children: "Alt" }), _jsx("p", { children: " + " }), _jsx("div", { className: "hotkey-button", children: "Shift" }), _jsx("p", { children: " + " }), _jsx("div", { className: "hotkey-button", children: "1-4" })] }), _jsx("div", { className: "no-favorite-snippets-text", children: chrome.i18n.getMessage("favoriteSnippetText2") })] })), _jsx(DragDropContext, { onDragEnd: handleOnDragEnd, children: _jsx(Droppable, { droppableId: "snippet-list-wrapper", children: (provided) => (_jsx(_Fragment, { children: _jsxs("div", { className: "snippet-list-wrapper", ...provided.droppableProps, ref: provided.innerRef, children: [favoriteSnippets.map((snippet, index) => (_jsx(Draggable, { draggableId: snippet.id, index: index, children: (provided, snapshot) => (_jsx(_Fragment, { children: _jsxs("div", { className: "draggableDiv", ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, style: getItemStyle(snapshot.isDragging, provided.draggableProps.style), children: [_jsx("div", { className: "snippet-title", children: snippet.title }), _jsx("button", { type: "button", className: "snippet-item-copy-button", onClick: (e) => handleCopyText(e, snippet.text), tabIndex: 0, "aria-label": "\uBCF5\uC0AC", children: _jsx(IoCopyOutline, { className: "copy-button" }) })] }) })) }, snippet.id))), provided.placeholder] }) })) }) })] }) }));
};
export default Favorite;
