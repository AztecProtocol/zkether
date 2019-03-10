import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import generateResponsiveStyleNames from '../../helpers/generateResponsiveStyleNames';
import generateResponsiveShape from '../../helpers/generateResponsiveShape';
import responsiveColumns from '../../shapes/responsiveColumns';
import responsiveTextAlign from '../../shapes/responsiveTextAlign';
import responsiveSizes from '../../shapes/responsiveSizes';
import './col.scss';

export const Col = ({
  className,
  column,
  shift,
  margin,
  background,
  align,
  style,
  children,
}) => (
  <div
    className={classnames(
      className,
      column && generateResponsiveStyleNames('col', column),
      shift && shift !== 0
        ? generateResponsiveStyleNames('shift', shift)
        : '',
      margin && margin !== 'none'
        ? generateResponsiveStyleNames('col-margin', margin)
        : '',
      (align && generateResponsiveStyleNames('col-align', align)) || '',
      {
        [`col-bg-${background}`]: background,
      },
    )}
    style={style}
  >
    {children}
  </div>
);

Col.propTypes = {
  className: PropTypes.string,
  column: responsiveColumns,
  shift: generateResponsiveShape([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  margin: responsiveSizes,
  background: PropTypes.string,
  align: responsiveTextAlign,
  style: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
};

Col.defaultProps = {
  className: '',
  column: 'auto',
  shift: 0,
  margin: 'm',
  background: '',
  align: '',
  style: null,
  children: null,
};

export default Col;
