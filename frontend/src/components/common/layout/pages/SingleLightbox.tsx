import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';

const SingleLightbox = ({ thumb, className, large }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NavLink to="#" onClick={() => {return setIsOpen(true)}}>
        <img src={thumb} alt="thumbnail" className={className} />
      </NavLink>

      {isOpen && (
        <Lightbox mainSrc={large} onCloseRequest={() => {return setIsOpen(false)}} />
      )}
    </>
  );
};
export default SingleLightbox;
