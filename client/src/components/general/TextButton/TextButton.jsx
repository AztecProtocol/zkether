import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import responsiveTextSizes from '../../shapes/responsiveTextSizes';
import Clickable from '../../utils/Clickable/Clickable';
import Text from '../Text/Text';
import {
  textColorNames,
} from '../../config/colors';
import {
  fontWeightKeys,
} from '../../config/typography';
import './button.scss';

export const TextButton = ({
  styleName,
  theme,
  text,
  children,
  size,
  weight,
  color,
  href,
  onClick,
  isRouterLink,
  stopPropagation,
  disabled,
}) => (
  <Clickable
    styleName={classnames(
      styleName,
      'text-button',
      {
        [`text-button-theme-${theme}`]: theme !== 'normal',
        [`text-button-color-${color}`]: color && color !== 'inherit',
        'text-button-disabled': disabled,
      },
    )}
    href={href}
    onClick={onClick}
    isRouterLink={isRouterLink}
    stopPropagation={stopPropagation}
    disabled={disabled}
  >
    <Text
      text={text}
      size={size}
      weight={weight}
    >
      {children}
    </Text>
  </Clickable>
);

TextButton.propTypes = {
  styleName: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'normal', 'underline']),
  text: PropTypes.string,
  children: PropTypes.node,
  size: responsiveTextSizes,
  weight: PropTypes.oneOf(fontWeightKeys),
  color: PropTypes.oneOf(textColorNames),
  href: PropTypes.string,
  onClick: PropTypes.func,
  isRouterLink: PropTypes.bool,
  stopPropagation: PropTypes.bool,
  disabled: PropTypes.bool,
};

TextButton.defaultProps = {
  styleName: '',
  theme: 'normal',
  text: '',
  children: null,
  size: 'inherit',
  weight: 'book',
  color: 'secondary',
  href: '',
  onClick: null,
  isRouterLink: false,
  stopPropagation: false,
  disabled: false,
};

export default TextButton;
