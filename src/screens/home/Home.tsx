import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Category, Item } from '../../model/Item';
import { RealmContext } from '../../model';
import { useNavigateToHomeTableItemForm } from './useNavigateToHomeTableItemForm';

interface TableRowProps {
  name: string;
  price: number;
  category: Category;
  date: Date;
}

const TableHeadData: string[] = ['상품명', '금액', '카테고리', '날짜'];
const TableRowData: TableRowProps[] = [
  {
    name: '햄버거',
    price: 10000,
    category: '야미',
    date: new Date(),
  },
  {
    name: '옷장',
    price: 420000,
    category: '의류미용',
    date: new Date(),
  },
  {
    name: '피파 현질',
    price: 100000,
    category: '쓸데 없는',
    date: new Date(),
  },
  {
    name: '피씨방',
    price: 10000,
    category: '쓸데 없는',
    date: new Date(),
  },
  {
    name: '피씨방 식사',
    price: 12000,
    category: '야미',
    date: new Date(),
  },
];

const Home = () => {
  const [tableRow, setTableRow] = useState<Item[]>();
  const fetchedData = RealmContext.useQuery(Item);

  const navigateToHomeTableItemForm = useNavigateToHomeTableItemForm();

  useEffect(() => {
    const data = fetchedData.map((val: Item) => {
      return val;
    });
    setTableRow(data);
  }, [fetchedData]);

  const handlePressSubmit = useCallback(() => {
    navigateToHomeTableItemForm();
  }, [navigateToHomeTableItemForm]);

  const renderItem = ({ item }: { item: TableRowProps }) => {
    return (
      <View
        style={{
          borderRadius: 10,
          flex: 1,
          borderWidth: 2,
          borderColor: '#000',
          padding: 10,
          marginBottom: 15,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ flex: 1, textAlign: 'left' }}>{item.name}</Text>
          <Text style={{ flex: 1, textAlign: 'right' }}>{item.price}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ flex: 1, textAlign: 'left' }}>{item.category}</Text>
          <Text style={{ flex: 1, textAlign: 'right' }}>
            {item.date.toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}
    >
      <FlatList
        style={{ padding: 10 }}
        data={tableRow}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 0,
          flex: 1,
          alignItems: 'center',
          width: '100%',
          height: 50,
          backgroundColor: 'gray',
          justifyContent: 'center',
        }}
        onPress={handlePressSubmit}
      >
        <Text
          style={{
            textAlign: 'center',
            flex: 1,
            justifyContent: 'center',
            textAlignVertical: 'center',
            color: 'white',
          }}
        >
          Add Item!!!
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
