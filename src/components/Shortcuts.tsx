import { DragEvent } from 'react';

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
    const url = e.dataTransfer.getData('text/uri-list');
    // Handle the dropped URL as needed
    console.log(url); // For demonstration
  };

  return (
    <div
      id='shortcuts'
      className="unselectable"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p className="sheen-text">Drop Links Here</p>
      {/* <Shortcut /> */}
    </div>
  );
};

export default Shortcuts;
