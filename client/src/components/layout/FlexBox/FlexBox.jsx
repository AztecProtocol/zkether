import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import generateResponsiveStyleNames, {
  notEmptyString,
} from '../../helpers/generateResponsiveStyleNames';
import generateResponsiveShape from '../../helpers/generateResponsiveShape';
import './flex.scss';

export const FlexBox = ({
  styleName,
  direction,
  align,
  valign,
  expand,
  fixedWidth,
  stretch,
  nowrap,
  children,
}) => (
  <div
    className={classnames(
      styleName,
      'flex-box',
      generateResponsiveStyleNames('flex-align', align, notEmptyString),
      generateResponsiveStyleNames('flex-valign', valign, notEmptyString),
      generateResponsiveStyleNames('flex-nowrap', nowrap),
      {
        [`dir-${direction}`]: direction !== 'row',
        expand,
        fixedWidth,
        stretch,
      },
    )}
  >
    {children}
  </div>
);

FlexBox.propTypes = {
  styleName: PropTypes.string,
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
  expand: PropTypes.bool,
  fixedWidth: PropTypes.bool,
  stretch: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

FlexBox.defaultProps = {
  className: '',
  direction: 'row',
  align: '',
  valign: '',
  expand: false,
  fixedWidth: false,
  stretch: false,
  nowrap: false,
};

export default FlexBox;
