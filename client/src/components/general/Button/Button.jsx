import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  inputSizeKeys,
  defaultInputSizeKey,
} from '../../config/inputs';
import generateResponsiveStyleNames from '../../helpers/generateResponsiveStyleNames';
import generateResponsiveShape from '../../helpers/generateResponsiveShape';
import './button.scss';

export const Button = ({
  styleName,
  theme,
  size,
  expand,
  text,
  icon,
  alignIcon,
  children,
  outlined,
  rounded,
  isLoading,
  disabled,
  href,
  stopPropagation,
  onClick,
  onSubmit,
}) => {
  const ButtonTag = href && !disabled
    ? 'a'
    : 'button';

  return (
    <ButtonTag
      className={classnames(
        styleName,
        'button',
        generateResponsiveStyleNames('button-size', size),
        generateResponsiveStyleNames('button-expand', expand),
        {
          [`button-theme-${theme}`]: theme,
          'disabled-hover': isLoading || disabled,
          outlined,
          rounded,
          'button-loading': isLoading,
          'button-disabled': disabled,
        },
      )}
      href={href}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }

        const openLinkInNewTab = href && (e.metaKey || e.ctrlKey);
        if (openLinkInNewTab) return;

        if (onClick || onSubmit) {
          e.preventDefault();
          if (onClick) {
            onClick();
          }

          if (onSubmit && !disabled && !isLoading) {
            onSubmit();
          }
        }
      }}
    >
      {alignIcon === 'left' && icon && (
        <div
          className={classnames({
            'icon-left': children || text,
          })}
        >
          {icon}
        </div>
      )}
      {children || text}
      {alignIcon === 'right' && icon && (
        <div
          className={classnames({
            'icon-right': children || text,
          })}
        >
          {icon}
        </div>
      )}
    </ButtonTag>
  );
};

Button.propTypes = {
  styleName: PropTypes.string,
  theme: PropTypes.oneOf(['primary', 'secondary', 'white']),
  size: generateResponsiveShape(inputSizeKeys),
  text: PropTypes.string,
  icon: PropTypes.element,
  alignIcon: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node,
  outlined: PropTypes.bool,
  expand: generateResponsiveShape([true, false]),
  rounded: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  stopPropagation: PropTypes.bool,
  onClick: PropTypes.func,
  onSubmit: PropTypes.func,
};

Button.defaultProps = {
  styleName: '',
  theme: 'primary',
  size: defaultInputSizeKey,
  expand: false,
  text: '',
  icon: null,
  alignIcon: 'right',
  children: null,
  outlined: false,
  rounded: false,
  isLoading: false,
  disabled: false,
  href: '',
  stopPropagation: false,
  onClick: null,
  onSubmit: null,
};

export default Button;
