import React from 'react';
import { View } from 'react-native';

interface VerticalSpacerProps {
  size: number;
}

export const VerticalSpacer: React.FC<VerticalSpacerProps> = ({ size }) => {
  return <View style={{ height: size }} />;
};
