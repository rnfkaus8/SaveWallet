import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProps } from './SvgProps';

const RightArrow = ({ width, height, fillColor }: SvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
    >
      <Path
        fill={fillColor}
        d="M13.668 18.677 17.346 15a1.413 1.413 0 0 0 0-2.002L13.668 9.32c-.895-.895-2.429-.256-2.429 1.008v7.356c0 1.264 1.534 1.89 2.428.994Z"
      />
    </Svg>
  );
};
export default RightArrow;
