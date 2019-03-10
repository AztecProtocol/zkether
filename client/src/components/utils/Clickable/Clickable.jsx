import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './clickable.scss';

class Clickable extends PureComponent {
  justClicked = false;

  handleClick = (e) => {
    const {
      onClick,
      href,
      doubleClickBufferTime,
      disabled,
      stopPropagation,
      disabledDoubleClick,
    } = this.props;

    if (stopPropagation) {
      e.stopPropagation();
    }

    if (!onClick || disabled) return;

    if (disabledDoubleClick) {
      if (this.justClicked) {
        return;
      }

      this.justClicked = true;
      setTimeout(() => {
        this.justClicked = false;
      }, doubleClickBufferTime);
    }

    if (!href || (!e.metaKey && !e.ctrlKey)) {
      e.preventDefault();
      onClick();
    }
  };

  render() {
    const {
      styleName,
      children,
      onClick,
      href,
      disabled,
      inline,
    } = this.props;

    const Tag = href && !disabled
      ? 'a'
      : 'div';

    return (
      <Tag
        className={classnames(styleName, {
          clickable: !disabled,
          'clickable-inline': inline,
        })}
        href={href}
        onClick={(onClick && this.handleClick) || null}
      >
        {children}
      </Tag>
    );
  }
}

Clickable.propTypes = {
  styleName: PropTypes.string,
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
  doubleClickBufferTime: PropTypes.number,
  stopPropagation: PropTypes.bool,
  disabled: PropTypes.bool,
  disabledDoubleClick: PropTypes.bool,
  inline: PropTypes.bool,
};

Clickable.defaultProps = {
  styleName: '',
  href: '',
  onClick: null,
  doubleClickBufferTime: 400,
  stopPropagation: false,
  disabled: false,
  disabledDoubleClick: false,
  inline: false,
};

export default Clickable;
