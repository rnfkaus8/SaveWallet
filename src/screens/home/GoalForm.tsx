import { TextInput, View } from 'react-native';
import React, { useCallback, useState } from 'react';

export const GoalForm = () => {
  const [goal, setGoal] = useState(0);
  const [goalStr, setGoalStr] = useState('');
  const handleChangeGoal = useCallback((text: string) => {
    setGoalStr(text);
    setGoal(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);
  return (
    <View>
      <TextInput
        value={goalStr}
        keyboardType="number-pad"
        onChangeText={handleChangeGoal}
      />
    </View>
  );
};
