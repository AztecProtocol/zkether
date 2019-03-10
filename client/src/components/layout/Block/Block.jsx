import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import generateResponsiveStyleNames from '../../helpers/generateResponsiveStyleNames';
import generateResponsiveShape from '../../helpers/generateResponsiveShape';
import parseCssSizeValues from '../../helpers/parseCssSizeValues';
import responsiveCssSizes from '../../shapes/responsiveCssSizes';
import {
  roundedCornerKeys,
  shadowLayerKeys,
} from '../../config/shapes';
import './block.scss';

export const Block = ({
  styleName,
  style,
  padding,
  top,
  right,
  bottom,
  left,
  background,
  borderColor,
  hasBorder,
  hasBorderTop,
  hasBorderRight,
  hasBorderBottom,
  hasBorderLeft,
  layer,
  align,
  stretch,
  inline,
  rounded,
  overflowHidden,
  relative,
  children,
  onClick,
}) => {
  const sizeMap = {
    top,
    right,
    bottom,
    left,
    ...parseCssSizeValues(padding),
  };

  const sizeStyleNames = ['all', 'top', 'right', 'bottom', 'left']
    .filter(size => sizeMap[size])
    .map(size => generateResponsiveStyleNames(size, sizeMap[size]));

  const hasAnyBorder = hasBorder
    || hasBorderTop
    || hasBorderRight
    || hasBorderBottom
    || hasBorderLeft;

  return (
    <div
      className={classnames(
        styleName,
        ...sizeStyleNames,
        (align && generateResponsiveStyleNames('block-align', align)) || '',
        {
          [`block-bg-${background}`]: background,
          [`border-${borderColor}`]: hasAnyBorder && borderColor,
          'with-border': hasAnyBorder,
          'full-border': hasBorder,
          'border-top': hasBorderTop,
          'border-right': hasBorderRight,
          'border-bottom': hasBorderBottom,
          'border-left': hasBorderLeft,
          [`rounded-${rounded}`]: rounded && rounded !== 'none',
          'overflow-hidden': overflowHidden,
          [`layer-${layer}`]: layer,
          'block-stretch': stretch,
          inline,
          relative,
        },
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Block.propTypes = {
  styleName: PropTypes.string,
  style: PropTypes.object,
  padding: responsiveCssSizes,
  top: responsiveCssSizes,
  right: responsiveCssSizes,
  bottom: responsiveCssSizes,
  left: responsiveCssSizes,
  background: PropTypes.string,
  borderColor: PropTypes.string,
  hasBorder: PropTypes.bool,
  hasBorderTop: PropTypes.bool,
  hasBorderRight: PropTypes.bool,
  hasBorderBottom: PropTypes.bool,
  hasBorderLeft: PropTypes.bool,
  layer: PropTypes.oneOf(shadowLayerKeys),
  align: generateResponsiveShape(['', 'left', 'center', 'right']),
  stretch: PropTypes.bool,
  inline: PropTypes.bool,
  rounded: PropTypes.oneOf(['', ...roundedCornerKeys]),
  overflowHidden: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

Block.defaultProps = {
  styleName: '',
  style: {},
  padding: '',
  top: '',
  right: '',
  bottom: '',
  left: '',
  background: '',
  borderColor: '',
  hasBorder: false,
  hasBorderTop: false,
  hasBorderRight: false,
  hasBorderBottom: false,
  hasBorderLeft: false,
  layer: 0,
  align: '',
  stretch: false,
  inline: false,
  rounded: '',
  overflowHidden: false,
  children: null,
  onClick() {},
};

export default Block;
