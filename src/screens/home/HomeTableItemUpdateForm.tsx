import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment/moment';
import { Item } from '../../model/Item';
import { itemRepository } from '../../repository';
import { Category } from '../../model/Category';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';

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

const TextInputWrapper = styled.View`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: #f4f4f4;
`;

interface HomeTableItemUpdateFormProps {
  item: Item | null;
  onPressEdit: () => void;
  isOpenHomeTableItemUpdateForm: boolean;
  onRequestClose: () => void;
  categories: Category[];
}

const HomeTableItemUpdateForm: React.FC<HomeTableItemUpdateFormProps> = ({
  item,
  onPressEdit,
  isOpenHomeTableItemUpdateForm,
  onRequestClose,
  categories,
}) => {
  const [date, setDate] = useState<Date>(
    item ? new Date(item.boughtDate) : new Date(),
  );
  const [name, setName] = useState<string>(item ? item.name : '');
  const [price, setPrice] = useState<number>(item ? item.price : 0);
  const [priceStr, setPriceStr] = useState<string>(
    item ? item.price.toString() : '0',
  );
  const [categoryId, setCategoryId] = useState<number>(
    item ? item.categoryId : 0,
  );
  const [categoryList, setCategoryList] = useState(
    categories.map((category) => {
      return { label: category.name, value: category.id };
    }),
  );
  const [datePrickerOpen, setDatePickerOpen] = useState(false);

  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const updateItem = useCallback(async () => {
    if (item) {
      await itemRepository.update(item.id, name, price, date);
    }
  }, [date, item, name, price]);

  const handlePressSubmit = useCallback(async () => {
    await updateItem();
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
        <InputWrapper>
          <InputTitle>구매한 물건</InputTitle>
          <VerticalSpacer size={12} />
          <TextInputWrapper>
            <TextInput
              style={{
                fontSize: 16,
                fontFamily: 'Pretendard',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 24.0,
                backgroundColor: '#F4F4F4',
              }}
              placeholder="구매한 물건 이름을 적으세요."
              placeholderTextColor="#888888"
              onChangeText={setName}
              value={name}
            />
          </TextInputWrapper>
        </InputWrapper>
        <VerticalSpacer size={24} />
        <InputWrapper>
          <InputTitle>소비 금액</InputTitle>
          <VerticalSpacer size={12} />
          <TextInputWrapper>
            <TextInput
              style={{
                fontSize: 16,
                fontFamily: 'Pretendard',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 24.0,
                backgroundColor: '#F4F4F4',
              }}
              placeholder="소비 금액을 적으세요"
              keyboardType="number-pad"
              onChangeText={handleChangePrice}
              placeholderTextColor="#888888"
              value={priceStr}
            />
          </TextInputWrapper>
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
          <TouchableOpacity style={{ flex: 1 }} onPress={handlePressDatePicker}>
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
    </Modal>
  );
};

export default HomeTableItemUpdateForm;
