/* eslint-disable react/no-array-index-key */
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSprings, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import clamp from 'lodash.clamp';
import useWindowSize from '../../utils/useWindowSize';
import Image from '../Image';

/**
 * Gesture controlled surface that animates prev/next page changes via spring physics.
 *
 * @param {array} images Array of image objects to be shown in Lightbox
 * @param {number} currentIndex Index of image in images array that is currently shown
 * @param {function} onClickPrev True if this image is currently shown in pager, otherwise false
 * @param {function} onClickNext Function that can be called to disable dragging in the pager
 * @param {function} onClose Function that closes the Lightbox
 *
 * @see https://github.com/react-spring/react-use-gesture
 * @see https://github.com/react-spring/react-spring
 */
const ImagePager = ({
  images,
  currentIndex,
  onClickPrev,
  onClickNext,
  onClose
}) => {
  const firstRender = useRef(true);
  const { width: pageWidth } = useWindowSize();
  const [disableDrag, setDisableDrag] = useState(false);

  // Generate page positions based on current index
  const getPagePositions = (i, down = false, xDelta = 0) => {
    const x = (i - currentIndex) * pageWidth + (down ? xDelta : 0);
    if (i < currentIndex - 1 || i > currentIndex + 1)
      return { x, display: 'none' };
    return { x, display: 'block' };
  };

  /**
   * Animates translateX of all images at the same time
   *
   * https://www.react-spring.io/docs/hooks/use-springs
   */
  const [props, set] = useSprings(images.length, getPagePositions);

  // Animate page change if currentIndex changes
  useEffect(() => {
    // No need to set page position for initial render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Update page positions after prev/next page state change
    set(getPagePositions);
  });

  /**
   * Update each Image's visibility and translateX offset during dragging
   *
   * https://github.com/react-spring/react-use-gesture
   */
  const bind = useDrag(
    ({
      down,
      delta: [xDelta],
      direction: [xDir],
      velocity,
      distance,
      cancel,
      touches
    }) => {
      // Disable drag if Image has been zoomed in to allow for panning
      if (disableDrag) return;

      const draggedFarEnough = down && distance > pageWidth / 3;
      const draggedFastEnough = down && velocity > 2.8;

      // Handle next/prev image from valid drag
      if (draggedFarEnough || draggedFastEnough) {
        const goToIndex = clamp(
          currentIndex + (xDir > 0 ? -1 : 1),
          0,
          images.length - 1
        );

        // Cancel gesture animation
        cancel();

        if (goToIndex > currentIndex) onClickNext();
        if (goToIndex < currentIndex) onClickPrev();
      }

      // Don't move pager during two+ finger touch events, i.e. pinch-zoom
      if (touches > 1) return;

      // Update page x-coordinates for single finger/mouse gestures
      set(i => getPagePositions(i, down, xDelta));
    }
  );

  return props.map(({ x, display }, i) => (
    <AnimatedTranslate
      {...bind()}
      key={i}
      style={{
        display,
        transform: x.to(xInterp => `translateX(${xInterp}px)`)
      }}
    >
      <PageContentContainer
        // If the background is clicked, close the lightbox
        onClick={() => x.value === 0 && onClose()}
      >
        <Image
          setDisableDrag={setDisableDrag}
          src={images[i].src}
          alt={images[i].alt}
          isCurrentImage={i === currentIndex}
        />
      </PageContentContainer>
    </AnimatedTranslate>
  ));
};

ImagePager.propTypes = {
  /* Function that closes the Lightbox */
  onClose: PropTypes.func.isRequired,
  /* Function that triggers ImagePager to move to the previous image */
  onClickPrev: PropTypes.func.isRequired,
  /* Function that triggers ImagePager to move to the next image */
  onClickNext: PropTypes.func.isRequired,
  /* Index of image in images array that is currently shown */
  currentIndex: PropTypes.number.isRequired,
  /* Array of images to be shown in Lightbox */
  images: PropTypes.arrayOf(
    PropTypes.shape({
      /* The source URL of this image */
      src: PropTypes.string.isRequired,
      /* The alt attribute for this image */
      alt: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ImagePager;

const PageContentContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  user-select: none;
  touch-action: none;
`;

const AnimatedTranslate = animated(styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  will-change: transform;
  touch-action: none;
`);
