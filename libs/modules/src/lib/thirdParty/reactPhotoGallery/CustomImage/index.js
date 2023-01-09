import React, { useCallback } from 'react';
import Gallery from 'react-photo-gallery';
import SelectedImage from './SelectedImage';
import AppInfoView from '@crema/components/AppInfoView';
import { StyledReactGalleryPhoto } from '../index.styled';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';

const CustomImage = () => {
  const [{ apiData: photos, loading }] = useGetDataApi('/gallery/photos', []);

  const imageRenderer = useCallback(
    ({ index, left, top, key, photo }) => (
      <SelectedImage
        key={key}
        margin={'2px'}
        index={index}
        photo={photo}
        left={left}
        top={top}
      />
    ),
    [],
  );

  if (loading) {
    return <AppLoader />;
  }
  return (
    <StyledReactGalleryPhoto>
      <Gallery photos={photos} renderImage={imageRenderer} />
      <AppInfoView />
    </StyledReactGalleryPhoto>
  );
};
export default CustomImage;
