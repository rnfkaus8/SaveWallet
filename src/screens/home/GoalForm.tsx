import { Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Realm from 'realm';
import RealmContext from '../../model';

interface GoalFormProps {
  onPressSubmit: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onPressSubmit }) => {
  const [goal, setGoal] = useState(0);
  const [goalStr, setGoalStr] = useState('');
  const handleChangeGoal = useCallback((text: string) => {
    setGoalStr(text);
    setGoal(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);
  const realm = RealmContext.useRealm();

  const handlePressSubmit = useCallback(() => {
    realm.write(() => {
      realm.create('Goal', {
        id: new Realm.BSON.ObjectId(),
        date: new Date(),
        goalPrice: goal,
      });
    });
    onPressSubmit();
  }, [goal, onPressSubmit, realm]);

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
