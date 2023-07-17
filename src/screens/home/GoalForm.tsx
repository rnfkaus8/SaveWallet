import { TextInput, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export const GoalForm = () => {
  const [goal, setGoal] = useState(0);
  const [goalStr, setGoalStr] = useState('');
  const handleChangeGoal = useCallback((text: string) => {
    setGoalStr(text);
    setGoal(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);
  return (
    <View>
      <BottomSheetTextInput
        style={{
          padding: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#000',
        }}
        onChangeText={handleChangeGoal}
        value={goalStr}
      />
    </View>
  );
};
