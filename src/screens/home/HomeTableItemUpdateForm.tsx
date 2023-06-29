import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item } from '../../model/Item';
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

interface HomeTableItemUpdateFormProps {
  item: Item | null;
  onPressEdit: () => void;
}

const HomeTableItemUpdateForm: React.FC<HomeTableItemUpdateFormProps> = ({
  item,
  onPressEdit,
}) => {
  // const item: Item = RealmContext.useObject(Item, itemId);
  const [date, setDate] = useState<Date>(item ? item.date : new Date());
  const [name, setName] = useState<string>(item ? item.name : '');
  const [price, setPrice] = useState<number>(item ? item.price : 0);
  const [priceStr, setPriceStr] = useState<string>(
    item ? item.price.toString() : '0',
  );
  const [datePrickerOpen, setDatePickerOpen] = useState(false);

  const realm = RealmContext.useRealm();

  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

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
    onPressEdit();
  }, [onPressEdit, updateItem]);

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
    </SafeAreaView>
  );
};

export default HomeTableItemUpdateForm;
