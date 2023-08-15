import React, { useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { Item } from '../../model/Item';

const Wrapper = styled.View`
  padding: 40px;
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

interface HomeTableItemUpdateFormProps {
  item: Item;
  onPressEdit: () => void;
  isOpenHomeTableItemUpdateForm: boolean;
  onRequestClose: () => void;
}

const HomeTableItemUpdateForm: React.FC<HomeTableItemUpdateFormProps> = ({
  item,
  onPressEdit,
  isOpenHomeTableItemUpdateForm,
  onRequestClose,
}) => {
  const [date, setDate] = useState<Date>(item.boughtDate);
  const [name, setName] = useState<string>(item ? item.name : '');
  const [price, setPrice] = useState<number>(item ? item.price : 0);
  const [priceStr, setPriceStr] = useState<string>(
    item ? item.price.toString() : '0',
  );
  const [datePrickerOpen, setDatePickerOpen] = useState(false);

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const updateItem = useCallback(async () => {
    if (item) {
    }
  }, [item]);

  const handlePressSubmit = useCallback(() => {
    updateItem();
    onPressEdit();
  }, [onPressEdit, updateItem]);

  const handlePressDatePicker = useCallback(() => {
    setDatePickerOpen((prev) => {
      return !prev;
    });
  }, []);

  return (
    <Modal
      isVisible={isOpenHomeTableItemUpdateForm}
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
          <InputTitle>{new Date(date).toLocaleDateString()}</InputTitle>
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
          <Text>Update!!</Text>
        </TouchableOpacity>
      </Wrapper>
    </Modal>
  );
};

export default HomeTableItemUpdateForm;
