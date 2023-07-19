import { Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Realm from 'realm';
import RealmContext from '../../model';
import { Goal } from '../../model/Goal';

interface GoalFormProps {
  selectedMonthGoal: Goal | null;
  onPressSubmit: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  selectedMonthGoal,
  onPressSubmit,
}) => {
  const [goal, setGoal] = useState(
    selectedMonthGoal ? selectedMonthGoal.goalPrice : 0,
  );
  const [goalStr, setGoalStr] = useState(
    selectedMonthGoal ? selectedMonthGoal.goalPrice.toString : '',
  );
  const handleChangeGoal = useCallback((text: string) => {
    setGoalStr(text);
    setGoal(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);
  const realm = RealmContext.useRealm();
  const Goals = RealmContext.useQuery(Goal);

  const handlePressSubmit = useCallback(() => {
    if (selectedMonthGoal) {
      realm.write(() => {
        selectedMonthGoal.date = new Date();
        selectedMonthGoal.goalPrice = goal;
      });
    }
    onPressSubmit();
  }, [goal, onPressSubmit, realm, selectedMonthGoal]);

  return (
    <View style={{ padding: 40 }}>
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
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          backgroundColor: 'yellow',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handlePressSubmit}
      >
        <Text>Submit!!</Text>
      </TouchableOpacity>
    </View>
  );
};
