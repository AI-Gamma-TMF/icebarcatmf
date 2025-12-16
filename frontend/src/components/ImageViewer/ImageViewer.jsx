import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
// import { useTranslation } from 'react-i18next'
import "./style.css";
const ImageViewer = ({ thumbnailUrl, altText = 'Image', style }) => {
  const [isFits, setIsFits] = useState(false);
  const [gameImage, setGameImage] = useState('');
  // const { t } = useTranslation('casinoGames')

  const viewImg = (url) => {
    setIsFits(true);
    setGameImage(url);
  }

  return (
    <>

      {/* <span
        onClick={() => viewImg(thumbnailUrl)}
        className='text-link'
        style={{ cursor: 'pointer' }}
      > { t('viewThumbnail')} </span> */}

      <img
        style={style}
        src={thumbnailUrl}
        alt={altText}
        width={35}
        height={50}
        className='img-thumbnail'
        onClick={() => viewImg(thumbnailUrl)}
      />

      {isFits && (
        <Lightbox
          mainSrc={gameImage}
          enableZoom={false}
          onCloseRequest={() => setIsFits(false)}

        />
      )}

    </>
  );
}

export default ImageViewer;
