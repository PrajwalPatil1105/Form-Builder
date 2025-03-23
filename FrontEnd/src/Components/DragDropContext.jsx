import { createContext, useContext, useState } from "react";
const DragDropContext = createContext();
export const useDragDrop = () => useContext(DragDropContext);

export function DragDropProvider({ children }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const handleDragStart = (item) => {
    setDraggedItem(item);
  };
  const handleDragOver = (item) => {
    if (item !== dragOverItem) {
      setDragOverItem(item);
    }
  };

  const handleDragEnd = (items, setItems) => {
    if (!draggedItem || !dragOverItem) return;
    const itemsCopy = [...items];
    const draggedIndex = items.findIndex((item) => item.id === draggedItem.id);
    const dropIndex = items.findIndex((item) => item.id === dragOverItem.id);
    const [removed] = itemsCopy.splice(draggedIndex, 1);

    itemsCopy.splice(dropIndex, 0, removed);
    setItems(itemsCopy);
    setDraggedItem(null);
    setDragOverItem(null);
  };
  const value = {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
}

export default DragDropContext;
