import React from 'react';
import Row from '../components/layout/Row/Row';
import Col from '../components/layout/Col/Col';
import Block from '../components/layout/Block/Block';
import Icon from '../components/general/Icon/Icon';
import Button from '../components/general/Button/Button';

const ExchangeRow = ({
  isChangingDaiToZkdai,
  isChangingZkDaiToDai,
  onChangeDaiToZkdai,
  onChangeZkDaiToDai,
}) => (
  <Block
    padding="l 0"
  >
    <Row nowrap>
      <Col column={6}>
        <Button
          icon={(
            <Icon
              name={isChangingDaiToZkdai ? 'refresh' : 'arrow_upward'}
              spin={isChangingDaiToZkdai}
            />
          )}
          text="Ether to zkEther"
          onSubmit={!isChangingDaiToZkdai ? onChangeDaiToZkdai : undefined}
          disabled={isChangingZkDaiToDai}
          outlined
          expand
        />
      </Col>
      <Col column={6}>
        <Button
          icon={(
            <Icon
              name={isChangingZkDaiToDai ? 'refresh' : 'arrow_downward'}
              spin={isChangingZkDaiToDai}
            />
          )}
          text="zkEther to Ether"
          onSubmit={!isChangingZkDaiToDai ? onChangeZkDaiToDai : undefined}
          disabled={isChangingDaiToZkdai}
          outlined
          expand
        />
      </Col>
    </Row>
  </Block>
);

export default ExchangeRow;
