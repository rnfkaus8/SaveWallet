import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProps } from './SvgProps';

const UpArrow = ({ width, height, fillColor, style }: SvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
      fill="none"
    >
      <Path
        fill={fillColor}
        d="M10.579 4.832 6.901 1.154a1.414 1.414 0 0 0-2.002 0L1.22 4.832c-.895.895-.256 2.429 1.008 2.429h7.356c1.264 0 1.889-1.534.994-2.429Z"
      />
    </Svg>
  );
};
export default UpArrow;
