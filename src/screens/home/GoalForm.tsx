import { Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import Modal from 'react-native-modal';
import { Goal } from '../../model/Goal';
import { goalRepository } from '../../repository';

interface GoalFormProps {
  isOpenGoalForm: boolean;
  onRequestClose: () => void;
  selectedMonthGoal: Goal | null;
  onPressSubmit: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  selectedMonthGoal,
  onPressSubmit,
  isOpenGoalForm,
  onRequestClose,
}) => {
  const [goal, setGoal] = useState(
    selectedMonthGoal ? selectedMonthGoal.goalPrice : 0,
  );
  const [goalStr, setGoalStr] = useState(
    selectedMonthGoal ? selectedMonthGoal.goalPrice.toString() : '',
  );
  const handleChangeGoal = useCallback((text: string) => {
    setGoalStr(text);
    setGoal(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const handlePressSubmit = useCallback(async () => {
    if (selectedMonthGoal) {
      await goalRepository.updateSelectedMonthGoalPrice(
        selectedMonthGoal.id,
        goal,
      );
      onPressSubmit();
    }
  }, [goal, onPressSubmit, selectedMonthGoal]);

  return (
    <Modal
      isVisible={isOpenGoalForm}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      onSwipeComplete={onRequestClose}
      useNativeDriverForBackdrop
      useNativeDriver
      swipeDirection="down"
    >
      <TextInput
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
    </Modal>
  );
};
