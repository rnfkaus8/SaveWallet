import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import HomeTable from './HomeTable';
import { Category } from '../../model/Item';

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
        onPress={() => {
          setTableRow((prev) => {
            return [
              ...prev,
              ['컴퓨터', 1000000, '쓸데 없는', new Date().toLocaleDateString()],
            ];
          });
        }}
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
