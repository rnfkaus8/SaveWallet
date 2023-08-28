import React from 'react';
import { View } from 'react-native';

interface HorizontalSpacerProps {
  size: number;
}

export const HorizontalSpacer: React.FC<HorizontalSpacerProps> = ({ size }) => {
  return <View style={{ width: size }} />;
};
