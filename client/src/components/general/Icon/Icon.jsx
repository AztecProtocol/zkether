import React from 'react';
import classnames from 'classnames';
import iconShape from '../../shapes/iconShape';
import generateResponsiveStyleNames from '../../helpers/generateResponsiveStyleNames';
import './icon.scss';

export const Icon = ({
  styleName,
  name,
  size,
  color,
  rotate,
  spin,
  flipHorizontal,
  flipVertical,
}) => (
  <i
    className={classnames(
      'material-icons cm-icon',
      styleName,
      (size && size !== 'inherit' && generateResponsiveStyleNames('size', size)) || '',
      {
        [`color-${color}`]: color,
        [`rotate-${rotate}`]: rotate,
        'flip-horizontal': flipHorizontal,
        'flip-vertical': flipVertical,
        spin,
      },
    )}
  >
    {name}
  </i>
);

Icon.propTypes = iconShape;

Icon.defaultProps = {
  styleName: '',
  size: 'inherit',
  color: '',
  rotate: 0,
  flipHorizontal: false,
  flipVertical: false,
  spin: false,
};

export default Icon;
