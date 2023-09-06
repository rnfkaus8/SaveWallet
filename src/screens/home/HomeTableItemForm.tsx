import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { itemRepository } from '../../repository';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import { Category } from '../../model/Category';
import UpArrow from '../../common/svg/UpArrow';

interface HomeTableItemFormProps {
  onPressSubmitItem(): void;
  isOpenHomeTableItemForm: boolean;
  onRequestClose(): void;
  memberId: number;
  categories: Category[];
}

const Wrapper = styled.View`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
  padding: 32px 20px;
`;

const InputWrapper = styled.View`
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const DateWrapper = styled.View`
  flex-direction: row;
  display: flex;
  align-items: flex-start;
  align-self: stretch;
`;

const InputTitle = styled.Text`
  color: #222;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24; /* 24px */
`;

const HomeTableItemForm: React.FC<HomeTableItemFormProps> = ({
  onPressSubmitItem,
  isOpenHomeTableItemForm,
  onRequestClose,
  memberId,
  categories,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [priceStr, setPriceStr] = useState('');
  const [datePrickerOpen, setDatePickerOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryList, setCategoryList] = useState(
    categories.map((category) => {
      return { label: category.name, value: category.id };
    }),
  );
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const saveItem = useCallback(async () => {
    try {
      await itemRepository.save(name, price, memberId, date, categoryId);
    } catch (e) {
      console.log(e);
    }
  }, [categoryId, date, memberId, name, price]);

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
      <KeyboardAvoidingView behavior="padding">
        <Wrapper>
          {categories && (
            <>
              <InputWrapper style={{ zIndex: 1000 }}>
                <InputTitle>카테고리</InputTitle>
                <VerticalSpacer size={12} />
                <DropDownPicker
                  open={dropDownOpen}
                  value={categoryId}
                  items={categoryList}
                  setOpen={setDropDownOpen}
                  setValue={setCategoryId}
                  setItems={setCategoryList}
                  onPress={Keyboard.dismiss}
                  placeholder="카테고리를 선택하세요"
                  listItemContainerStyle={{
                    backgroundColor: '#F4F4F4',
                  }}
                />
              </InputWrapper>
              <VerticalSpacer size={24} />
            </>
          )}
          <InputWrapper>
            <InputTitle>구매한 물건</InputTitle>
            <VerticalSpacer size={12} />
            <View
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 8,
                borderColor: '#F4F4F4',
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  fontFamily: 'Pretendard',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 24.0,
                }}
                onChangeText={setName}
                placeholder="구매한 물건 이름을 적으세요."
                value={name}
              />
            </View>
          </InputWrapper>
          <VerticalSpacer size={24} />
          <InputWrapper>
            <InputTitle>소비 금액</InputTitle>
            <VerticalSpacer size={12} />
            <View
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 8,
                borderColor: '#F4F4F4',
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  fontFamily: 'Pretendard',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 24.0,
                }}
                placeholder="소비 금액을 적으세요"
                keyboardType="number-pad"
                onChangeText={handleChangePrice}
                value={priceStr}
              />
            </View>
          </InputWrapper>
          <VerticalSpacer size={24} />
          <DateWrapper>
            <InputTitle style={{ flex: 1 }}>날짜</InputTitle>
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
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={handlePressDatePicker}
            >
              <Text
                style={{
                  color: '#888',
                  fontFamily: 'Pretendard',
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 24.0,
                  textAlign: 'right',
                }}
              >
                {moment(date).format('YYYY년 MM월 DD일')}
              </Text>
            </TouchableOpacity>
          </DateWrapper>
        </Wrapper>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#878787',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handlePressSubmit}
        >
          <Text
            style={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'Pretendard',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: '700',
            }}
          >
            저장
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default HomeTableItemForm;
