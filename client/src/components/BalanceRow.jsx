import React from 'react';
import PropTypes from 'prop-types';
import FlexBox from './layout/FlexBox/FlexBox';
import Block from './layout/Block/Block';
import Text from './general/Text/Text';

const BalanceRow = ({
  icon,
  name,
  value,
}) => (
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
      <Text
        text={value}
        size="m"
        weight="bold"
      />
    </FlexBox>
  </Block>
);

BalanceRow.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
};

BalanceRow.defaultProps = {
  icon: '',
  name: '',
  value: '',
};

export default BalanceRow;
