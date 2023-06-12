import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { Category, Item } from '../../model/Item';
import { RealmContext } from '../../model';
import { useNavigateToHomeTableItemForm } from './useNavigateToHomeTableItemForm';

interface TableRowProps {
  name: string;
  price: number;
  category: Category;
  date: Date;
}

const TabViewWrapper = styled.View`
  flex-direction: row;
`;

const TabView = styled.TouchableOpacity`
  background-color: lightgray;
  padding: 20px;
  flex: 1;
  align-items: center;
  justify-items: center;
`;

const ListWrapper = styled.View`
  padding-bottom: 50px;
`;

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
      <TabViewWrapper>
        <TabView>
          <Text>아낀 돈!</Text>
        </TabView>
        <TabView>
          <Text>낭비한 돈!</Text>
        </TabView>
      </TabViewWrapper>
      <ScrollView>
        <ListWrapper>
          <FlatList
            style={{ padding: 10 }}
            data={tableRow}
            renderItem={renderItem}
          />
        </ListWrapper>
      </ScrollView>
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
