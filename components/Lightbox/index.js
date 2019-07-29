import React from 'react';
import PropTypes from 'prop-types';
import { ImageStage, PageContainer, CreatePortal } from './components';

/**
 * Gesture controlled lightbox that interpolates animations with spring physics.
 *
 * @param {boolean} isOpen Flag that dictates if the lightbox is open or closed
 * @param {function} onClose Function that closes the Lightbox
 * @param {function} onClickPrev True if this image is currently shown in pager, otherwise false
 * @param {function} onClickNext Function that can be called to disable dragging in the pager
 * @param {number} currentIndex Index of image in images array that is currently shown
 * @param {ReactNode} renderHeader A React component that renders above the image pager
 * @param {ReactNonde} renderPagerButton A React component that is used for prev/next buttons, recieves position prop
 * @param {array} images Array of image objects to be shown in Lightbox
 *
 * @see https://github.com/react-spring/react-use-gesture
 * @see https://github.com/react-spring/react-spring
 */
class Lightbox extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onClickPrev: PropTypes.func.isRequired,
    onClickNext: PropTypes.func.isRequired,
    currentIndex: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number
      })
    ).isRequired,
    renderHeader: PropTypes.func,
    renderPagerButton: PropTypes.func
  };

  static defaultProps = {
    renderHeader: () => null,
    renderPagerButton: () => null
  };

  constructor(props) {
    super(props);

    this.state = {
      controlsAreHidden: false
    };
  }

  componentDidMount() {
    // Listen for keyboard events to control Lightbox
    document.addEventListener('keyup', this.handleKeyboardInput);
    document.addEventListener('keydown', this.preventBackgroundScroll);
  }

  componentWillUnmount() {
    // Remove event listeners when the component unmounts
    document.removeEventListener('keyup', this.handleKeyboardInput);
    document.removeEventListener('keydown', this.preventBackgroundScroll);
  }

  /**
   * Prevent keyboard from controlling background page
   * when lightbox is open
   */
  preventBackgroundScroll = e => {
    const { isOpen } = this.props;
    const keysToIgnore = [
      'ArrowUp',
      'ArrowDown',
      'End',
      'Home',
      'PageUp',
      'PageDown'
    ];

    if (isOpen && keysToIgnore.includes(e.key)) e.preventDefault();
  };

  /**
   * Navigate images with arrow keys, close on Esc key
   */
  handleKeyboardInput = e => {
    const { isOpen, onClickPrev, onClickNext, onClose } = this.props;

    if (isOpen) {
      switch (e.key) {
        case 'ArrowLeft':
          onClickPrev();
          break;
        case 'ArrowRight':
          onClickNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          e.preventDefault();
          break;
      }
    }
  };

  render() {
    const {
      isOpen,
      onClose,
      images,
      currentIndex,
      onClickPrev,
      onClickNext,
      renderHeader: HeaderBar,
      renderPagerButton
    } = this.props;

    const { controlsAreHidden } = this.state;

    return (
      <CreatePortal>
        <PageContainer isOpen={isOpen}>
          <HeaderBar />
          <ImageStage
            images={images}
            onClose={onClose}
            currentIndex={currentIndex}
            onClickPrev={onClickPrev}
            onClickNext={onClickNext}
            controlsAreHidden={controlsAreHidden}
            toggleControls={this.toggleControls}
            renderPagerButton={renderPagerButton}
          />
        </PageContainer>
      </CreatePortal>
    );
  }
}

export default Lightbox;
