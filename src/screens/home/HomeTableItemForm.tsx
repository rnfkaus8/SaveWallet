import React, { useCallback, useState } from 'react';
import Realm from 'realm';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CategoryArr } from '../../model/Item';
import { RealmContext } from '../../model';
import { useNavigateToHome } from './useNavigateToHome';

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

const Input = styled.TextInput`
  border-radius: 10px;
  border-width: 2px;
  border-color: #000;
`;

const HomeTableItemForm = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [priceStr, setPriceStr] = useState('');
  const [dropDownPickerItems, setDropDownPickerItems] = useState(
    CategoryArr.map((category) => {
      return {
        label: category === 'save' ? '아낀 돈!' : '낭비한 돈!',
        value: category,
      };
    }),
  );
  const [open, setOpen] = useState(false);
  const [datePrickerOpen, setDatePickerOpen] = useState(false);
  const [category, setCategory] = useState<Category>('save');

  const realm = RealmContext.useRealm();
  const navigateToHome = useNavigateToHome();

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const saveItem = useCallback(() => {
    realm.write(() => {
      realm.create('Item', {
        name,
        price,
        category,
        date,
        _id: new Realm.BSON.ObjectId(),
      });
    });
  }, [category, date, name, price, realm]);

  const handlePressSubmit = useCallback(() => {
    saveItem();
    navigateToHome();
  }, [navigateToHome, saveItem]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
      }}
    >
      <Wrapper>
        <InputWrapper>
          <InputTitle>상품명</InputTitle>
          <Input style={{ padding: 10 }} onChangeText={setName} value={name} />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>가격</InputTitle>
          <Input
            style={{ padding: 10 }}
            keyboardType="number-pad"
            onChangeText={handleChangePrice}
            value={priceStr}
          />
        </InputWrapper>
        <InputWrapper>
          <TouchableOpacity
            onPress={() => {
              setDatePickerOpen((prev) => {
                return !prev;
              });
            }}
          >
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
        <InputWrapper>
          <InputTitle>카테고리</InputTitle>
          <DropDownPicker
            setValue={setCategory}
            value={category}
            items={dropDownPickerItems}
            open={open}
            setOpen={setOpen}
          />
        </InputWrapper>
      </Wrapper>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 40,
          width: '100%',
          height: 50,
          backgroundColor: 'yellow',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handlePressSubmit}
      >
        <Text>Submit!!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeTableItemForm;
