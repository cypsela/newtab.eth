import React, { DragEvent } from "react";
import "../styles/Shortcuts.css";

// const Shortcut = (url: string) => {

//   return <></>
// }

const Shortcuts = () => {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow for dropping
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const url = e.dataTransfer.getData("text/uri-list");
    // Handle the dropped URL as needed
    console.log(url); // For demonstration
  };

  return (
    <div className="Shortcuts unselectable" onDragOver={handleDragOver} onDrop={handleDrop}>
      Drop Links Here
      {/* <Shortcut /> */}
    </div>
  );
};

export default Shortcuts;
