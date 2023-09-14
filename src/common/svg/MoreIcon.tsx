import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { SvgProps } from './SvgProps';

const MoreIcon = ({ width, height, fillColor }: SvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
    >
      <Circle
        cx={10}
        cy={5.083}
        r={1.25}
        fill={fillColor}
        transform="rotate(90 10 5.083)"
      />
      <Circle
        cx={10}
        cy={10.5}
        r={1.25}
        fill={fillColor}
        transform="rotate(90 10 10.5)"
      />
      <Circle
        cx={10}
        cy={15.917}
        r={1.25}
        fill={fillColor}
        transform="rotate(90 10 15.917)"
      />
    </Svg>
  );
};
export default MoreIcon;
