import React, { useCallback, useState } from 'react';
import Realm from 'realm';
import { Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigateToHome } from './useNavigateToHome';
import RealmContext from '../../model';

interface HomeTableItemFormProps {
  onPressSubmit: () => void;
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

const Input = styled.TextInput`
  border-radius: 10px;
  border-width: 2px;
  border-color: #000;
`;

const HomeTableItemForm: React.FC<HomeTableItemFormProps> = ({
  onPressSubmit,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [priceStr, setPriceStr] = useState('');
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
    <SafeAreaView
      style={{
        backgroundColor: 'white',
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
    </SafeAreaView>
  );
};

export default HomeTableItemForm;
