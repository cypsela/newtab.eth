import React, { DragEvent, useState } from 'react';

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setBackgroundImage(`url(${e.target.result})`);
      }
    };

    if (file instanceof File && file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      setBackgroundImage('')
    }
  };

  const message = backgroundImage === ''
    ? <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      color: 'white',
    }} >
      Drag and drop an image to set as background.
    </div>
    : <div />

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundSize: 'cover',
        backgroundImage: backgroundImage,
        backgroundPosition: 'center center', // Center the background image
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {message}
    </div>
  );
};

export default App;
