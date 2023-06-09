import React, { useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Category, CategoryArr } from '../../model/Item';
import { itemRepository } from '../../repository';

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
  const handleChangePrice = useCallback((text: string) => {
    setPriceStr(text);
    setPrice(parseInt(text.replace(/[^0-9]/g, ''), 10));
  }, []);

  const handlePressSubmit = useCallback(() => {
    itemRepository.save({
      name,
      price,
      category,
      date: new Date(),
    });
  }, [category, name, price]);
  return (
    <View>
      <TextInput onChangeText={setName} value={name} />
      <TextInput
        keyboardType="number-pad"
        onChangeText={handleChangePrice}
        value={priceStr}
      />
      <DropDownPicker
        setValue={setCategory}
        value={category}
        items={dropDownPickerItems}
        open={open}
        setOpen={setOpen}
      />
      <DatePicker date={date} onDateChange={setDate} />
      <TouchableOpacity onPress={handlePressSubmit}>
        <Text>Submit!!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeTableItemForm;
