import PropTypes from 'prop-types';
import responsiveTextSizes from '../shapes/responsiveTextSizes';
import {
  textColorNames,
} from '../config/colors';

export default {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: responsiveTextSizes,
  color: PropTypes.oneOf(['', ...textColorNames]),
  rotate: PropTypes.oneOf([0, 90, 180, 270]),
  flipHorizontal: PropTypes.bool,
  flipVertical: PropTypes.bool,
  spin: PropTypes.bool,
};
