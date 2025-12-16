import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import "./style.css";
const BannerViewer = ({
  thumbnailUrl,
  altText = "Image",
  width = 100,
  height = 100,
  isMobile
}) => {
  const [isFits, setIsFits] = useState(false);
  const [gameImage, setGameImage] = useState("");

  const viewImg = (url) => {
    setIsFits(true);
    setGameImage(url);
  };

  return (
    <>
      <div className="Image-preview" >
        <img
          src={thumbnailUrl}
          alt={altText}
          width={width}
          height={height}
          className="img-thumbnail"
          onClick={() => viewImg(thumbnailUrl)}
        />
      </div>
      {isFits && (
        <Lightbox
        mainSrc={gameImage}
        enableZoom={false}
        onCloseRequest={() => setIsFits(false)}
        wrapperClassName={isMobile ? "lightbox-mobile" : "lightbox-desktop"}
      />
      
      )}
    </>
  );
};

export default BannerViewer;
