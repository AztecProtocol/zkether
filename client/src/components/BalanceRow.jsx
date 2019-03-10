import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import FlexBox from './layout/FlexBox/FlexBox';
import Block from './layout/Block/Block';
import Text from './general/Text/Text';
import Icon from './general/Icon/Icon';
import TextButton from './general/TextButton/TextButton';
import TextInput from './form/TextInput/TextInput';
import MaskedNumberInput from './form/MaskedNumberInput/MaskedNumberInput';
import Button from './general/Button/Button';
import './balance.scss';

class BalanceRow extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      isLoading,
    } = nextProps;
    const {
      isLoading: wasLoading,
    } = prevState.prevProps;

    if (isLoading || !wasLoading) {
      return null;
    }

    return {
      amount: 0,
      showExportForm: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      address: '',
      amount: 0,
      showExportForm: false,
      prevProps: {
        isLoading: false,
      },
    };
  }

  toggleExportForm = () => {
    this.setState({
      showExportForm: !this.state.showExportForm,
    });
  };

  handleChangeAddress = (address) => {
    this.setState({
      address,
    });
  };

  handleChangeAmount = (amount) => {
    this.setState({
      amount,
    });
  };

  handleSend = () => {
    const {
      address,
      amount,
    } = this.state;
    const {
      onSend,
    } = this.props;

    onSend({
      address,
      amount,
    });
  };

  validToSend() {
    const {
      address,
      amount,
    } = this.state;
    const {
      value,
    } = this.props;

    return address.length === 42
      && amount > 0
      && +amount <= +value;
  }

  renderExportForm() {
    const {
      symbol,
      isSending,
    } = this.props;
    const {
      address,
      amount,
    } = this.state;

    return (
      <Block
        padding="l 0"
        align="left"
      >
        <Block
          padding="m"
          background="grey-lightest"
        >
          <Block padding="s 0">
            <Block bottom="xs">
              <Text
                text="Address"
                color="label"
                size="xxs"
                weight="bold"
              />
            </Block>
            <TextInput
              size="s"
              value={address}
              onChange={this.handleChangeAddress}
            />
          </Block>
          <Block padding="s 0">
            <Block bottom="xs">
              <Text
                text="Amount"
                color="label"
                size="xxs"
                weight="bold"
              />
            </Block>
            <MaskedNumberInput
              prefix={symbol ? `${symbol} ` : ''}
              size="s"
              value={amount}
              onChange={this.handleChangeAmount}
              allowDecimal
            />
          </Block>
          <Block
            padding="m 0 s"
            align="right"
          >
            <Button
              text="Send"
              icon={!isSending ? null : (
                <Icon
                  name="refresh"
                  size="xxs"
                  spin
                />
              )}
              size="s"
              onClick={!isSending ? this.handleSend : undefined}
              disabled={!this.validToSend()}
            />
          </Block>
        </Block>
      </Block>
    );
  }

  render() {
    const {
      icon,
      name,
      value,
      symbol,
      allowToSend,
    } = this.props;

    const {
      showExportForm,
    } = this.state;

    return (
      <Block padding="l 0">
        <FlexBox
          align="space-between"
          valign="center"
        >
          <FlexBox
            valign="center"
          >
            <img
              src={icon}
              alt={name}
              style={{
                width: '50px',
                height: '50px',
              }}
            />
            <Block
              padding="0 m"
            >
              <Text
                text={name}
                size="m"
              />
            </Block>
          </FlexBox>
          <div className="pos-relative">
            <Text
              text={`${symbol ? `${symbol} ` : ''}${value}`}
              size="m"
              weight="bold"
            />
            {allowToSend && (
              <div className="send-to-address-button">
                <TextButton
                  text={`(${showExportForm ? 'cancel' : 'send to address'})`}
                  onClick={this.toggleExportForm}
                  size="xxs"
                />
              </div>
            )}
          </div>
        </FlexBox>
        {showExportForm && this.renderExportForm()}
      </Block>
    );
  }
}

BalanceRow.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  symbol: PropTypes.string,
  allowToSend: PropTypes.bool,
  isSending: PropTypes.bool,
  onSend: PropTypes.func,
};

BalanceRow.defaultProps = {
  icon: '',
  name: '',
  value: '',
  symbol: '$',
  allowToSend: false,
  isSending: false,
  onSend() {},
};

export default BalanceRow;
