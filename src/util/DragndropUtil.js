export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
export const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging ? "#ADACB5" : "white",
    ...draggableStyle,
});
