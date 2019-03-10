import React from 'react';
import Row from './layout/Row/Row';
import Col from './layout/Col/Col';
import Block from './layout/Block/Block';
import Icon from './general/Icon/Icon';
import Button from './general/Button/Button';

const ExchangeRow = ({
  isChangingXDaiToZkdai,
  isChangingZkDaiToXdai,
  onChangeXDaiToZkdai,
  onChangeZkDaiToXdai,
}) => (
  <Block
    padding="l 0"
  >
    <Row nowrap>
      <Col column={6}>
        <Button
          icon={(
            <Icon
              name={isChangingZkDaiToXdai ? 'refresh' : 'arrow_downward'}
              spin={isChangingZkDaiToXdai}
            />
          )}
          text="zkDai to xDAI"
          onSubmit={!isChangingZkDaiToXdai ? onChangeZkDaiToXdai : undefined}
          disabled={isChangingXDaiToZkdai}
          outlined
          expand
        />
      </Col>
      <Col column={6}>
        <Button
          icon={(
            <Icon
              name={isChangingXDaiToZkdai ? 'refresh' : 'arrow_upward'}
              spin={isChangingXDaiToZkdai}
            />
          )}
          text="xDAI to zkDai"
          onSubmit={!isChangingXDaiToZkdai ? onChangeXDaiToZkdai : undefined}
          disabled={isChangingZkDaiToXdai}
          outlined
          expand
        />
      </Col>
    </Row>
  </Block>
);

export default ExchangeRow;
