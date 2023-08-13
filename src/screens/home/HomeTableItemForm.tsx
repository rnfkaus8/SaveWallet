import React, { useCallback, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { itemRepository } from '../../repository';

interface HomeTableItemFormProps {
  onPressSubmitItem(): void;
  isOpenHomeTableItemForm: boolean;
  onRequestClose(): void;
  memberId: number;
}

const Wrapper = styled.View`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
  padding: 20px;
`;

const InputWrapper = styled.View`
  margin-bottom: 10px;
`;

const InputTitle = styled.Text`
  text-align: left;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const HomeTableItemForm: React.FC<HomeTableItemFormProps> = ({
  onPressSubmitItem,
  isOpenHomeTableItemForm,
  onRequestClose,
  memberId,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [priceStr, setPriceStr] = useState('');
  const [datePrickerOpen, setDatePickerOpen] = useState(false);

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const saveItem = useCallback(async () => {
    await itemRepository.save(name, price, memberId, date);
  }, [date, memberId, name, price]);

  const handlePressSubmit = useCallback(async () => {
    await saveItem();
    onPressSubmitItem();
  }, [saveItem, onPressSubmitItem]);

  const handlePressDatePicker = useCallback(() => {
    setDatePickerOpen((prev) => {
      return !prev;
    });
  }, []);

  return (
    <Modal
      isVisible={isOpenHomeTableItemForm}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      onSwipeComplete={onRequestClose}
      useNativeDriverForBackdrop
      useNativeDriver
      swipeDirection="down"
    >
      <Wrapper>
        <InputWrapper>
          <InputTitle>상품명</InputTitle>
          <TextInput
            style={{
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#000',
            }}
            onChangeText={setName}
            value={name}
          />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>가격</InputTitle>
          <TextInput
            style={{
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#000',
            }}
            keyboardType="number-pad"
            onChangeText={handleChangePrice}
            value={priceStr}
          />
        </InputWrapper>
        <InputWrapper>
          <TouchableOpacity onPress={handlePressDatePicker}>
            <InputTitle>날짜</InputTitle>
          </TouchableOpacity>
          <DatePicker
            modal
            date={date}
            open={datePrickerOpen}
            mode="date"
            onConfirm={(confirmedDate) => {
              setDatePickerOpen(false);
              setDate(confirmedDate);
            }}
            onCancel={() => {
              setDatePickerOpen(false);
            }}
          />
          <InputTitle>{date.toLocaleDateString()}</InputTitle>
        </InputWrapper>
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
      </Wrapper>
    </Modal>
  );
};

export default HomeTableItemForm;
