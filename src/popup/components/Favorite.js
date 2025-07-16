import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { getItemStyle } from "../../util/DragndropUtil";
import { IoCopyOutline } from "react-icons/io5";
import { PiStarFill } from "react-icons/pi";
import { useState, useEffect } from "react";
import "./Favorite.scss";
const handleOnDragEnd = () => {
    return null;
};
const Favorite = () => {
    const [favoriteSnippets, setFavoriteSnippets] = useState([]);
    useEffect(() => {
        chrome.storage.local.get(["favoriteSnippets"], (result) => {
            const storedSnippets = result.favoriteSnippets ?? [];
            setFavoriteSnippets(storedSnippets);
        });
    }, []);
    return (_jsx("div", { className: "wrapper", children: _jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "favorite-snippets-header", children: [_jsx(PiStarFill, { className: "favorite-snippets-header-icon" }), "\uC990\uACA8\uCC3E\uAE30"] }), favoriteSnippets.length === 0 && (_jsxs("div", { className: "no-favorite-snippets-wrapper", children: [_jsx("div", { className: "no-favorite-snippets-text", children: "\uC990\uACA8\uCC3E\uAE30 \uCD94\uAC00\uD558\uC2DC\uACE0" }), _jsxs("div", { className: "no-favorite-snippets-hotkey", children: [_jsx("div", { className: "hotkey-button", children: "Alt" }), _jsx("p", { children: " + " }), _jsx("div", { className: "hotkey-button", children: "Shift" }), _jsx("p", { children: " + " }), _jsx("div", { className: "hotkey-button", children: "1-9" })] }), _jsx("div", { className: "no-favorite-snippets-text", children: "\uB97C \uB20C\uB7EC \uBE60\uB974\uAC8C \uC2A4\uB2C8\uD3AB\uC744 \uC785\uB825\uD574\uBCF4\uC138\uC694!" })] })), _jsx(DragDropContext, { onDragEnd: handleOnDragEnd, children: _jsx(Droppable, { droppableId: "favorite-snippet-list-wrapper", children: (provided) => (_jsx(_Fragment, { children: _jsxs("div", { className: "favorite-snippet-list-wrapper", ...provided.droppableProps, ref: provided.innerRef, children: [favoriteSnippets.map((snippet, index) => (_jsx(Draggable, { draggableId: snippet.id, index: index, children: (provided, snapshot) => (_jsx(_Fragment, { children: _jsxs("div", { className: "draggableDiv", 
                                                // onClick={() => openModal(snippet)}
                                                ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, style: getItemStyle(snapshot.isDragging, provided.draggableProps.style), children: [_jsx("div", { className: "snippet-title", children: snippet.title }), _jsx("button", { type: "button", className: "snippet-item-copy-button", 
                                                        // onClick={(e) => handleCopyText(e, snippet.text)}
                                                        tabIndex: 0, "aria-label": "\uBCF5\uC0AC", children: _jsx(IoCopyOutline, { className: "copy-button" }) })] }) })) }, snippet.id))), provided.placeholder] }) })) }) })] }) }));
};
export default Favorite;
