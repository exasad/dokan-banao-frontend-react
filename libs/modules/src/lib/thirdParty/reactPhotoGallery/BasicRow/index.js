import React from 'react';
import Gallery from 'react-photo-gallery';
import { photos } from '@crema/fakedb/data';
import { StyledReactGalleryPhoto } from '../index.styled';

const BasicRow = () => {
  return (
    <StyledReactGalleryPhoto>
      <Gallery photos={photos} />
    </StyledReactGalleryPhoto>
  );
};
export default BasicRow;
