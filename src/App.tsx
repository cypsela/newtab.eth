import { DragEvent, useEffect, useState } from 'react';
import { BrowserLevel } from 'browser-level';
import './App.css';
import Shortcuts from './components/Shortcuts';

console.log('testing IPNS republishing with fleek')

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

const dashVisibilityLocalStorageKey = 'dashVisibility'

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [checkedForBackground, setCheckedForBackground] = useState<boolean>(false)
  const backgroundImageSet = backgroundImage !== '';

  const persistedDashVisibility = localStorage.getItem(dashVisibilityLocalStorageKey)
  const [visibleDash, setDashVisibility] = useState<boolean>(persistedDashVisibility != null ? JSON.parse(persistedDashVisibility) : false)

  useEffect(() => {
    if (!checkedForBackground) {
      void loadBackgroundImage(currentBackgroundKey)
        .then((dataUrl: string) => {
          setBackgroundImage(dataUrl)
          setCheckedForBackground(true)
        })
    }
  }, [checkedForBackground]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key === 'D') {
        setDashVisibility(prevState => !prevState);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dashVisibility', JSON.stringify(visibleDash))
  }, [visibleDash])

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

        if (dataUrl === backgroundImage) {
          setBackgroundImage('');
          void saveBackgroundImage(currentBackgroundKey, '');
        } else {
          setBackgroundImage(dataUrl);
          void saveBackgroundImage(currentBackgroundKey, dataUrl);
        }
      }
    };

    if (file instanceof File && file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
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
        visibleDash && <Shortcuts />
      ) : (
        checkedForBackground && backgroundHelper
      )}
    </div>
  );
};

export default App;
