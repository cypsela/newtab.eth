import { DragEvent, useEffect, useState } from 'react';
import { BrowserLevel } from 'browser-level';
import './App.css';
import Shortcuts from './components/Shortcuts';

const currentBackgroundKey = 'current';
const backgroundImageDb = new BrowserLevel('backgroundImages', {
  version: 1,
  prefix: '',
});
const saveBackgroundImage = async (
  key: string,
  dataUrl: string
): Promise<void> => {
  if (backgroundImageDb.status !== 'open') {
    await backgroundImageDb.open();
  }

  await backgroundImageDb.put(key, dataUrl);
};
const loadBackgroundImage = async (key: string): Promise<string> => {
  if (backgroundImageDb.status !== 'open') {
    await backgroundImageDb.open();
  }

  try {
    return await backgroundImageDb.get(key);
  } catch (e) {
    return '';
  }
};

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [checkedForBackground, setCheckedForBackground] = useState<boolean>(false)
  const backgroundImageSet = backgroundImage !== '';

  useEffect(() => {
    if (!checkedForBackground) {
      void loadBackgroundImage(currentBackgroundKey)
        .then((dataUrl: string) => {
          setBackgroundImage(dataUrl)
          setCheckedForBackground(true)
        })
    }
  }, [checkedForBackground]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const dataUrl = `url(${e.target.result})`;
        setBackgroundImage(dataUrl);
        void saveBackgroundImage(currentBackgroundKey, dataUrl);
      }
    };

    if (file instanceof File && file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      setBackgroundImage('');
      void saveBackgroundImage(currentBackgroundKey, '');
    }
  };

  const backgroundHelper = (
    <div
      id="backgroundHelper"
      className="unselectable sheen-text"
    >
      Drag and drop an image to set as background.
    </div>
  );

  return (
    <div
      id="backgroundImage"
      style={{ backgroundImage: backgroundImage }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {backgroundImageSet ? (
        <Shortcuts />
      ) : (
        checkedForBackground && backgroundHelper
      )}
    </div>
  );
};

export default App;
