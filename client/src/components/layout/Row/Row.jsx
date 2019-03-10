import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import generateResponsiveShape from '../../helpers/generateResponsiveShape';
import generateResponsiveStyleNames from '../../helpers/generateResponsiveStyleNames';
import responsiveSizes from '../../shapes/responsiveSizes';
import FlexBox from '../FlexBox/FlexBox';
import './row.scss';

export const Row = ({
  margin,
  ...props
}) => (
  <FlexBox
    styleName={classnames((margin && margin !== 'none' && generateResponsiveStyleNames('row-margin', margin)) || '')}
    {...props}
  />
);

Row.propTypes = {
  className: PropTypes.string,
  margin: responsiveSizes,
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
  align: generateResponsiveShape([
    '',
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  valign: generateResponsiveShape([
    '',
    'flex-start',
    'flex-end',
    'center',
    'stretch',
    'baseline',
  ]),
  nowrap: generateResponsiveShape([true, false]),
  stretch: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Row.defaultProps = {
  className: '',
  margin: 'm',
  direction: 'row',
  align: '',
  valign: '',
  nowrap: false,
  stretch: false,
};

export default Row;
