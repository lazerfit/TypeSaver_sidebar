import {
  DragDropContext,
  Draggable,
  type DraggableProvided,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { getItemStyle, reorder } from "../../util/DragndropUtil";
import { handleCopyText } from "../../util/CommonUtils";
import { IoCopyOutline } from "react-icons/io5";
import { PiStarFill } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Snippet } from "./Vault";
import "./Favorite.scss";

const Favorite = () => {
  const [favoriteSnippets, setFavoriteSnippets] = useState<Snippet[]>([]);
  const navigate = useNavigate();

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      favoriteSnippets,
      result.source.index,
      result.destination.index,
    );

    chrome.storage.local.set({ ["favoriteSnippets"]: reorderedItems }, () => {
      setFavoriteSnippets(reorderedItems);
    });
  };

  useEffect(() => {
    chrome.storage.local.get(["favoriteSnippets"], (result) => {
      const storedSnippets: Snippet[] =
        (result.favoriteSnippets as Snippet[]) ?? [];
      setFavoriteSnippets(storedSnippets);
    });
  }, []);

  return (
    <div className="wrapper">
      <div className="content-wrapper">
        <div className="favorite-snippets-header">
          <PiStarFill className="favorite-snippets-header-icon" />
          즐겨찾기
        </div>
        {favoriteSnippets.length === 0 && (
          <div className="no-favorite-snippets-wrapper">
            <div className="no-favorite-snippets-text">
              {chrome.i18n.getMessage("favoriteSnippetText1")}
            </div>
            <div className="no-favorite-snippets-hotkey">
              <div className="hotkey-button">Alt</div>
              <p> + </p>
              <div className="hotkey-button">A, S, Z, X</div>
            </div>
            <div className="no-favorite-snippets-text">
              {chrome.i18n.getMessage("favoriteSnippetText2")}
            </div>
            <div className="hotkey-button">whale://extensions/shortcuts</div>
            <div className="no-favorite-snippets-text">
              {chrome.i18n.getMessage("favoriteSnippetText3")}
            </div>
            <button
              className="add-button"
              onClick={() => void navigate("/Vault")}
            >
              {chrome.i18n.getMessage("addFavoriteSnippet")}
            </button>
          </div>
        )}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="snippet-list-wrapper">
            {(provided) => (
              <>
                <div
                  className="snippet-list-wrapper"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {favoriteSnippets.map((snippet, index) => (
                    <Draggable
                      key={snippet.id}
                      draggableId={snippet.id}
                      index={index}
                    >
                      {(provided: DraggableProvided, snapshot) => (
                        <>
                          <div
                            className="draggableDiv"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <div className="snippet-title">{snippet.title}</div>
                            <button
                              type="button"
                              className="snippet-item-copy-button"
                              onClick={(e) => handleCopyText(e, snippet.text)}
                              tabIndex={0}
                              aria-label="복사"
                            >
                              <IoCopyOutline className="copy-button" />
                            </button>
                          </div>
                        </>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Favorite;
