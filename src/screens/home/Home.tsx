import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import Realm from 'realm';
import HomeTable from './HomeTable';
import { Category, Item } from '../../model/Item';
import { RealmContext } from '../../model';

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
  const { useRealm, useQuery } = RealmContext;
  const realm = useRealm();
  const itemList = useQuery(Item);

  const [tableHead, setTableHead] = useState(TableHeadData);
  const [tableRow, setTableRow] = useState(
    TableRowData.map((data) => {
      return [
        data.name,
        data.price,
        data.category,
        data.date.toLocaleDateString(),
      ];
    }),
  );

  useEffect(() => {
    console.log(itemList);
  }, [itemList]);

  const handlePressSubmit = useCallback(() => {
    const dateString = new Date().toLocaleDateString();
    setTableRow((prev) => {
      return [...prev, ['컴퓨터', 1000000, '쓸데 없는', dateString]];
    });
    const id = new Realm.BSON.ObjectId();
    realm.write(() => {
      realm.create('Item', {
        name: '컴퓨터',
        price: '1000000',
        category: '쓸데 없는',
        date: dateString,
        _id: id,
      });
    });
  }, [realm]);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}
    >
      <HomeTable tableHead={tableHead} tableRow={tableRow} />
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
