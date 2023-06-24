import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { Item } from '../../model/Item';
import { useNavigateToHomeTableItemForm } from './useNavigateToHomeTableItemForm';
import { edit, trashcan } from '../../assets/resources/images';
import RealmContext from '../../model';
import { useNavigateToHomeTableItemUpdateForm } from './useNavigateToHomeTableItemUpdateForm';

interface TableRowProps {
  name: string;
  price: number;
  date: Date;
}

const TabViewWrapper = styled.View`
  flex-direction: row;
`;

const TabView = styled.TouchableOpacity`
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
  const [totalPrice, setTotalPrice] = useState(0);
  const itemLists = RealmContext.useQuery(Item);
  const realm = RealmContext.useRealm();

  const navigateToHomeTableItemForm = useNavigateToHomeTableItemForm();
  const navigateToHomeTableItemUpdateForm =
    useNavigateToHomeTableItemUpdateForm();

  const fetchingData = useCallback(() => {
    setTotalPrice(0);
    setTableRow(
      itemLists.map((val: Item) => {
        setTotalPrice((prev) => {
          return prev + val.price;
        });
        return val;
      }),
    );
  }, [itemLists]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  const handlePressSubmit = useCallback(() => {
    navigateToHomeTableItemForm();
  }, [navigateToHomeTableItemForm]);

  const handlePressDelete = useCallback(
    (item: Item) => {
      realm.write(() => {
        realm.delete(item);
      });
      fetchingData();
    },
    [fetchingData, realm],
  );

  const handlePressEdit = useCallback(
    (item: Item) => {
      navigateToHomeTableItemUpdateForm({ itemId: item._id });
    },
    [navigateToHomeTableItemUpdateForm],
  );

  const renderItem = ({ item }: { item: Item }) => {
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
          <TouchableOpacity
            onPress={() => {
              handlePressDelete(item);
            }}
          >
            <Image source={trashcan} style={{ width: 14, height: 14 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handlePressEdit(item);
            }}
          >
            <Image source={edit} style={{ width: 14, height: 14 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ flex: 1, textAlign: 'right' }}>
            {item.date.toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}
      >
        <View
          style={{
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>총 금액 : {totalPrice}</Text>
        </View>
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
            width: '100%',
            height: 50,
            backgroundColor: 'gray',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handlePressSubmit}
        >
          <Text>Add Item!!!</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView />
    </>
  );
};

export default Home;
