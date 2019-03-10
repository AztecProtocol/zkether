import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import generateResponsiveStyleNames from '../../helpers/generateResponsiveStyleNames';
import responsiveTextSizes from '../../shapes/responsiveTextSizes';
import {
  textColorNames, colorNames,
} from '../../config/colors';
import {
  fontWeightKeys,
} from '../../config/typography';
import './text.scss';

export const Text = ({
  styleName,
  text,
  children,
  size,
  color,
  highlight,
  weight,
  textAlign,
  showEllipsis,
}) => (
  <div
    className={classnames(
      'text',
      styleName,
      (size
        && size !== 'inherit'
        && generateResponsiveStyleNames('text-size', size))
        || '',
      {
        [`text-color-${color}`]: color,
        [`highlight-${highlight}`]: highlight,
        [`weight-${weight}`]: weight && weight !== 'inherit',
        [`text-align-${textAlign}`]: textAlign && textAlign !== 'inherit',
        'show-ellipsis': showEllipsis,
      }
    )}
  >
    {children || text}
  </div>
);

Text.propTypes = {
  className: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  size: responsiveTextSizes,
  color: PropTypes.oneOf(['', ...textColorNames]),
  textAlign: PropTypes.oneOf(['center', 'left', 'right', 'inherit']),
  highlight: PropTypes.oneOf(['', ...colorNames]),
  showEllipsis: PropTypes.bool,
  weight: PropTypes.oneOf(fontWeightKeys),
};

Text.defaultProps = {
  className: '',
  text: '',
  children: null,
  size: 'inherit',
  textAlign: 'inherit',
  color: '',
  highlight: '',
  showEllipsis: false,
  weight: 'inherit',
};

export default Text;
