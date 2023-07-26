import React, { useCallback, useEffect, useState } from 'react';
import Realm from 'realm';
import { KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Modal from 'react-native-modal';
import RealmContext from '../../model';
import { Item } from '../../model/Item';

interface HomeTableItemFormProps {
  onPressSubmit: () => void;
  isOpenHomeTableItemForm: boolean;
  onRequestClose(): void;
}

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

const HomeTableItemForm: React.FC<HomeTableItemFormProps> = ({
  onPressSubmit,
  isOpenHomeTableItemForm,
  onRequestClose,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [priceStr, setPriceStr] = useState('');
  const [datePrickerOpen, setDatePickerOpen] = useState(false);

  const realm = RealmContext.useRealm();

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const saveItem = useCallback(() => {
    realm.write(() => {
      realm.create('Item', {
        name,
        price,
        date,
        _id: new Realm.BSON.ObjectId(),
      });
    });
  }, [date, name, price, realm]);

  const handlePressSubmit = useCallback(() => {
    saveItem();
    onPressSubmit();
  }, [saveItem, onPressSubmit]);

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
          <BottomSheetTextInput
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
          <BottomSheetTextInput
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
