import React, { DragEvent, useEffect, useState } from "react";
import { BrowserLevel } from "browser-level";
import Shortcuts from "./components/Shortcuts";

const currentBackgroundKey = "current";
const backgroundImageDb = new BrowserLevel("backgroundImages", {
  version: 1,
  prefix: "",
});
const saveBackgroundImage = async (
  key: string,
  dataUrl: string
): Promise<void> => {
  if (backgroundImageDb.status !== "open") {
    await backgroundImageDb.open();
  }

  await backgroundImageDb.put(key, dataUrl);
};
const loadBackgroundImage = async (key: string): Promise<string> => {
  if (backgroundImageDb.status !== "open") {
    await backgroundImageDb.open();
  }

  try {
    return await backgroundImageDb.get(key);
  } catch (e) {
    return "";
  }
};

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    void loadBackgroundImage(currentBackgroundKey).then(setBackgroundImage);
  }, []);

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

    if (file instanceof File && file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      setBackgroundImage("");
      void saveBackgroundImage(currentBackgroundKey, "");
    }
  };

  const backgroundImageSet = backgroundImage !== "";

  const dragAndDropBackgroundImage = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        color: "white",
      }}
    >
      Drag and drop an image to set as background.
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundSize: "cover",
        backgroundImage: backgroundImage,
        backgroundPosition: "center center", // Center the background image
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {backgroundImageSet ? <Shortcuts /> : dragAndDropBackgroundImage}
    </div>
  );
};

export default App;
