import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProps } from './SvgProps';

const LeftArrow = ({ width, height, fillColor }: SvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
    >
      <Path
        fill={fillColor}
        d="M15.332 9.323 11.654 13a1.413 1.413 0 0 0 0 2.002l3.678 3.678c.895.895 2.429.255 2.429-1.008v-7.356c0-1.264-1.534-1.89-2.428-.994Z"
      />
    </Svg>
  );
};
export default LeftArrow;
