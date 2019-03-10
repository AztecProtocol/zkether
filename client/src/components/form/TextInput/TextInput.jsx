import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  inputThemeNames,
  inputSizeKeys,
  defaultInputSizeKey,
} from '../../config/inputs';
import iconShape from '../../shapes/iconShape';
import Block from '../../layout/Block/Block';
import Text from '../../general/Text/Text';
import Icon from '../../general/Icon/Icon';
import './input.scss';

class TextInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      isErrorControlled,
    } = prevState;

    if (!isErrorControlled) {
      return null;
    }

    const {
      error,
      value,
      withErrorShakeEffect,
    } = nextProps;
    const {
      error: prevError,
      prevProps,
    } = prevState;
    const {
      value: prevValue,
    } = prevProps;
    if (error === prevError && !(error && value !== prevValue)) {
      // don't restart shake animation
      return null;
    }

    return {
      shakeInput: withErrorShakeEffect && !!error,
      showErrorStatus: !!error,
      error,
      prevProps: {
        value,
      },
    };
  }

  constructor(props) {
    super(props);

    const {
      value,
      error,
    } = props;
    this.isControlled = value !== undefined;

    this.state = {
      isErrorControlled: error !== undefined,
      shakeInput: false,
      showErrorStatus: false,
      error: '',
      prevProps: { // eslint-disable-line react/no-unused-state
        value: '',
      },
    };

    this.input = null;
    this.clearTemporaryErrorReq = null;

    this.setInputRef = this.setInputRef.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.clearTemporaryError();
  }

  componentDidUpdate() {
    this.clearTemporaryError();
  }

  componentWillUnmount() {
    clearTimeout(this.clearTemporaryErrorReq);
  }

  setInputRef(ref) {
    this.input = ref;
    this.props.setInputRef(ref);
  }

  getValue() {
    return this.isControlled ? this.props.value : this.input.value;
  }

  /*
   * allow parent to manually focus on this input
   */
  focus() {
    if (this.props.disabled) return;
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  clearTemporaryError() {
    const {
      shakeInput,
    } = this.state;
    if (shakeInput) {
      clearTimeout(this.clearTemporaryErrorReq);
      this.clearTemporaryErrorReq = setTimeout(() => {
        if (this.state.shakeInput) {
          this.setState({
            shakeInput: false,
          });
        }
      }, 300);
    }
  }

  handleClick(e) {
    const {
      disabled,
    } = this.props;
    if (disabled) {
      e.preventDefault();
      this.blur();
      return;
    }

    this.props.onClick(e);
  }

  handleFocus(e) {
    const {
      disabled,
    } = this.props;
    if (disabled) {
      e.preventDefault();
      this.blur();
      return;
    }

    const {
      readOnly,
      selectAllOnFocus,
    } = this.props;
    if (!readOnly && selectAllOnFocus) {
      this.input.select();
    }

    this.props.onFocus(e);
  }

  handleChange(e) {
    const {
      disabled,
      readOnly,
    } = this.props;
    if (disabled || readOnly) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return;
    }

    const {
      validate,
      withErrorShakeEffect,
    } = this.props;
    const {
      isErrorControlled,
    } = this.state;
    const {
      value,
    } = e.target;

    if (!isErrorControlled) {
      const {
        success,
        error,
      } = validate(value);
      if (!success) {
        e.preventDefault();
        this.setState({
          shakeInput: withErrorShakeEffect,
          showErrorStatus: true,
          error,
        });
        return;
      }

      const {
        shakeInput,
        showErrorStatus,
      } = this.state;
      if (shakeInput || showErrorStatus) {
        this.setState({
          shakeInput: false,
          showErrorStatus: false,
        });
      }
    }

    this.props.onChange(value);
  }

  handleKeyDown(e) {
    const {
      disabled,
    } = this.props;
    if (disabled) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return;
    }

    switch (e.keyCode) {
      case 13:
        this.props.onSubmit();
        break;
      default:
    }

    this.props.onKeyDown(e);
  }

  renderInput() {
    const {
      type,
      name,
      value,
      defaultValue,
      placeholder,
      rows,
      autoCapitalize,
      autoComplete,
      autoCorrect,
      spellCheck,
      tabIndex,
      disabled,
      readOnly,
    } = this.props;

    const TagName = type === 'textarea' ? 'textarea' : 'input';
    const props = {};
    if (this.isControlled) {
      props.value = value;
    } else if (defaultValue) {
      props.defaultValue = defaultValue;
    }

    return (
      <TagName
        {...props}
        className="input"
        ref={this.setInputRef}
        type={type}
        name={name}
        rows={rows}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        tabIndex={tabIndex}
        disabled={disabled}
        readOnly={readOnly}
        onClick={this.handleClick}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
      />
    );
  }

  renderIcon() {
    const {
      icon,
      onClick,
      onClickIcon,
    } = this.props;

    if (!icon) {
      return null;
    }

    const onClickCallback = onClickIcon || onClick;

    return (
      <div
        className={classnames(
          'status-icon',
          {
            clickable: onClickCallback,
          },
        )}
        onClick={(e) => {
          if (onClickCallback) {
            e.stopPropagation(); // prevent triggering onClick twice
            onClickCallback();
          }
        }}
      >
        <Icon {...icon} />
      </div>
    );
  }

  render() {
    const {
      styleName,
      theme,
      size,
      readOnly,
      disabled,
      status,
      icon,
      onClick,
    } = this.props;
    const {
      shakeInput,
      showErrorStatus,
      error,
    } = this.state;

    const holderStyleName = classnames(
      'holder',
      `size-${size}`,
      {
        disabled,
        clickable: readOnly && onClick,
        'flash-error': shakeInput,
        'status-error': showErrorStatus,
        'with-icon': icon,
        [`status-${status}`]: status,
        [`theme-${theme}`]: theme,
      },
    );

    return (
      <div
        className={classnames(
          holderStyleName,
          styleName,
        )}
      >
        {this.renderInput()}
        {!!error && (
          <div className={classnames('error', {
            hide: !showErrorStatus,
          })}
          >
            <Block
              className="error-content"
              padding="m"
              background="white"
              rounded="default"
              layer={2}
            >
              <Text
                size="xxs"
                color="red"
                weight="bold"
                text={error}
              />
            </Block>
          </div>
        )}
        {this.renderIcon()}
      </div>
    );
  }
}

TextInput.propTypes = {
  styleName: PropTypes.string,
  theme: PropTypes.oneOf(inputThemeNames),
  size: PropTypes.oneOf(inputSizeKeys),
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.shape(iconShape),
  error: PropTypes.string,
  rows: PropTypes.number,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  selectAllOnFocus: PropTypes.bool,
  status: PropTypes.oneOf(['', 'focus', 'error', 'warning']),
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  autoComplete: PropTypes.string,
  autoCorrect: PropTypes.oneOf(['on', 'off']),
  spellCheck: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onClickIcon: PropTypes.func,
  setInputRef: PropTypes.func,
  validate: PropTypes.func,
  withErrorShakeEffect: PropTypes.bool,
};

TextInput.defaultProps = {
  styleName: '',
  theme: 'default',
  size: defaultInputSizeKey,
  type: 'text',
  name: '',
  value: undefined,
  defaultValue: '',
  placeholder: '',
  icon: null,
  error: undefined,
  rows: 1,
  tabIndex: 0,
  disabled: false,
  readOnly: false,
  selectAllOnFocus: false,
  status: '',
  autoCapitalize: 'none',
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: false,
  onClick() {},
  onFocus() {},
  onKeyDown() {},
  onChange() {},
  onSubmit() {},
  onClickIcon: undefined,
  setInputRef() {},
  validate: () => ({
    success: true,
    error: '',
  }),
  withErrorShakeEffect: false,
};

export default TextInput;
