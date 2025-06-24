import type {DraggableStyle} from "@hello-pangea/dnd";

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const getItemStyle = (isDragging: boolean, draggableStyle: DraggableStyle | undefined) => ({
    background: isDragging ? "#ADACB5" : "white",
    ...draggableStyle
});