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
      return { label: category, value: category };
    }),
  );
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>('야미');

  const realm = RealmContext.useRealm();
  const navigateToHome = useNavigateToHome();

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const handlePressSubmit = useCallback(() => {
    realm.write(() => {
      realm.create('Item', {
        name,
        price,
        category,
        date: new Date(),
        _id: new Realm.BSON.ObjectId(),
      });
    });

    navigateToHome();
  }, [category, name, navigateToHome, price, realm]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        position: 'relative',
        height: '100%',
      }}
    >
      <Wrapper>
        <InputWrapper>
          <InputTitle>상품명</InputTitle>
          <Input onChangeText={setName} value={name} />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>가격</InputTitle>
          <Input
            keyboardType="number-pad"
            onChangeText={handleChangePrice}
            value={priceStr}
          />
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
        <InputWrapper>
          <DatePicker date={date} onDateChange={setDate} />
        </InputWrapper>
      </Wrapper>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          backgroundColor: 'yellow',
        }}
        onPress={handlePressSubmit}
      >
        <Text>Submit!!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeTableItemForm;
