import React, { Component } from 'react';
import Block from './components/layout/Block/Block';
import FlexBox from './components/layout/FlexBox/FlexBox';
import BalanceRow from './components/BalanceRow';
import ExchangeRow from './components/ExchangeRow';
import Icon from './components/general/Icon/Icon';
import Text from './components/general/Text/Text';
import zkdaiIcon from './assets/aztec.png';
import zdaiIcon from './assets/xdai.jpg';
import './App2.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Block padding="xxl xl">
          <Block
            styleName="App-content"
            padding="xl"
            background="white"
            rounded="default"
            hasBorder
          >
            <BalanceRow
              icon={zkdaiIcon}
              name="zkDai"
              value="$0.01"
            />
            <ExchangeRow
              isChangingXDaiToZkdai={true}
              isChangingZkDaiToXdai={false}
              onChangeXDaiToZkdai={() => {}}
              onChangeZkDaiToXdai={() => {}}
            />
            <BalanceRow
              icon={zdaiIcon}
              name="zDai"
              value="$1.0"
            />
          </Block>
        </Block>
        <Block
          styleName="disclaimer"
          padding="xl l"
        >
          <FlexBox
            align="center"
            valign="center"
          >
            <Block right="s">
              <Icon
                name="warning"
                size="l"
                color="yellow"
              />
            </Block>
            <Text
              text="Users may lose all of their money"
              color="white"
            />
          </FlexBox>
        </Block>
      </div>
    );
  }
}

export default App;
