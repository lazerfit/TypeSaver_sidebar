import {DragDropContext, Draggable, type DraggableProvided, Droppable} from "@hello-pangea/dnd";
import {getItemStyle} from "../../util/DragndropUtil";
import {IoCopyOutline} from "react-icons/io5";
import { PiStarFill } from "react-icons/pi";
import {useState, useEffect} from "react";
import type {Snippet} from "./Vault";
import "./Favorite.scss";

const handleOnDragEnd = () => {
    return null;
}

const Favorite = () => {
    const [favoriteSnippets, setFavoriteSnippets] = useState<Snippet[]>([]);

    useEffect(() => {
        chrome.storage.local.get(["favoriteSnippets"], (result) => {
            const storedSnippets: Snippet[] = (result.favoriteSnippets as Snippet[]) ?? [];
            setFavoriteSnippets(storedSnippets);
        })
    },[]);

    return (
        <div className="wrapper">
            <div className="content-wrapper">
                <div className="favorite-snippets-header">
                    <PiStarFill className="favorite-snippets-header-icon" />
                    즐겨찾기
                </div>
                {
                    favoriteSnippets.length === 0 && (
                        <div className="no-favorite-snippets-wrapper">
                            <div className="no-favorite-snippets-text">
                                즐겨찾기 추가하시고
                            </div>
                            <div className="no-favorite-snippets-hotkey">
                                <div className="hotkey-button">Alt</div>
                                <p> + </p>
                                <div className="hotkey-button">Shift</div>
                                <p> + </p>
                                <div className="hotkey-button">1-9</div>
                            </div>
                            <div className="no-favorite-snippets-text">
                                를 눌러 빠르게 스니펫을 입력해보세요!
                            </div>
                        </div>
                    )
                }
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="favorite-snippet-list-wrapper">
                        {(provided) => (
                            <>
                                <div className="favorite-snippet-list-wrapper" {...provided.droppableProps}
                                     ref={provided.innerRef}>
                                    {favoriteSnippets.map((snippet, index) => (
                                        <Draggable key={snippet.id} draggableId={snippet.id} index={index}>
                                            {(provided: DraggableProvided, snapshot) => (
                                                <>
                                                    <div
                                                        className="draggableDiv"
                                                        // onClick={() => openModal(snippet)}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                    >
                                                        <div className="snippet-title">
                                                            {snippet.title}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="snippet-item-copy-button"
                                                            // onClick={(e) => handleCopyText(e, snippet.text)}
                                                            tabIndex={0}
                                                            aria-label="복사"
                                                        >
                                                            <IoCopyOutline className="copy-button"/>
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