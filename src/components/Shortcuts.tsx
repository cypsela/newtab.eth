import { DragEvent, useState, type SyntheticEvent } from 'react';

const Shortcut = ({ url, key }: { url: string, key: number }) => {
  // Assuming the favicon is located at the root as /favicon.ico
  const parsedUrl = new URL(url)
  const faviconUrl = new URL('/favicon.ico', url).href
  const siteName = parsedUrl.hostname.split('.').slice(-2)[0]

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = './favicon.ico'
  }

  return (
    <div className="shortcut" key={key}>
      <a href={url} rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ alignItems: 'center' }}>
          <img src={faviconUrl} alt={url} draggable={false} style={{ width: '64px', height: '64px', display: "block" }} onError={handleError}/>
          <p className="sheen-text" style={{ fontSize: "12px", marginTop: "5px", marginBottom: "5px", textAlign: "center" }}>{siteName}</p>
        </div>
      </a>
    </div>
  );
}

const Shortcuts = () => {
  const [urls, setUrls] = useState<string[]>([])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow for dropping
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const url = e.dataTransfer.getData('text/uri-list');
    // Handle the dropped URL as needed

    try {
      new URL(url)

      if (urls.includes(url)) {
        setUrls([...urls.filter((u: string) => url !== u)])
      } else {
        setUrls([...urls, url])
      }
    } catch (e) {}
  };

  const existingUrls = urls.length > 0

  return (
    <div
      id='shortcuts'
      className="unselectable"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        justifyContent: existingUrls ? "left" : "center"
      }}
    >
      {
        existingUrls
          ? urls.map((url: string, key: number)=> Shortcut({ url, key }))
          : <p className="sheen-text">Drop Links Here</p>
      }
    </div>
  );
};

export default Shortcuts;
