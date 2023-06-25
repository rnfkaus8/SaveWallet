import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Realm, { UpdateMode } from 'realm';
import { Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useNavigateToHome } from './useNavigateToHome';
import { Item } from '../../model/Item';
import { HomeTableItemUpdateFormParams } from './useNavigateToHomeTableItemUpdateForm';
import RealmContext from '../../model';

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

const HomeTableItemUpdateForm = () => {
  const route = useRoute();
  const { itemId } = route.params as HomeTableItemUpdateFormParams;
  const item: Item = RealmContext.useObject(Item, itemId);
  const [date, setDate] = useState<Date>(item.date);
  const [name, setName] = useState<string>(item.name);
  const [price, setPrice] = useState<number>(item.price);
  const [priceStr, setPriceStr] = useState<string>(item.price.toString());
  const [datePrickerOpen, setDatePickerOpen] = useState(false);

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
        date,
        _id: new Realm.BSON.ObjectId(),
      });
    });
  }, [date, name, price, realm]);

  const updateItem = useCallback(() => {
    if (item) {
      realm.write(() => {
        item.name = name;
        item.price = price;
        item.date = date;
      });
    }
  }, [date, item, name, price, realm]);

  const handlePressSubmit = useCallback(() => {
    updateItem();
    navigateToHome();
  }, [navigateToHome, updateItem]);

  const handlePressDatePicker = useCallback(() => {
    setDatePickerOpen((prev) => {
      return !prev;
    });
  }, []);

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
        <Text>Update!!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeTableItemUpdateForm;
