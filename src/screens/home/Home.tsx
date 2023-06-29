import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Item } from '../../model/Item';
import { edit, trashcan } from '../../assets/resources/images';
import RealmContext from '../../model';
import HomeTableItemForm from './HomeTableItemForm';
import HomeTableItemUpdateForm from './HomeTableItemUpdateForm';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';

const ListWrapper = styled.View`
  flex: 1;
  padding-bottom: 50px;
`;

const RowWrapper = styled.TouchableOpacity`
  border-radius: 10px;
  border-width: 2px;
  border-color: #000;
  padding: 10px;
  margin-bottom: 15px;
  position: relative;
`;

const Row = styled.View`
  flex: 1;
  flex-direction: row;
`;

const ToggleWrapper = styled.View`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  border-color: black;
  border-width: 1px;
  border-radius: 5px;
  padding: 10px;
`;

const Home = () => {
  const [tableRow, setTableRow] = useState<Item[]>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const itemLists = RealmContext.useQuery(Item);
  const realm = RealmContext.useRealm();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetUpdateModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => {
    return ['25%', '50%'];
  }, []);

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

  const handlePressAddItem = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePressEditItem = useCallback(() => {
    bottomSheetUpdateModalRef.current?.present();
  }, []);

  const handlePressDelete = useCallback(
    (item: Item) => {
      realm.write(() => {
        realm.delete(item);
      });
      fetchingData();
    },
    [fetchingData, realm],
  );

  const handlePressSubmit = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handlePressEdit = useCallback(() => {
    bottomSheetUpdateModalRef.current?.dismiss();
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Item>) => {
      const isSelectedItem =
        selectedItem?._id.toString() === item._id.toString();
      return (
        <RowWrapper
          onPress={() => {
            bottomSheetUpdateModalRef.current?.dismiss();
            if (isSelectedItem) {
              setSelectedItem(null);
              return;
            }
            setSelectedItem(item);
          }}
        >
          <Row>
            <Text style={{ flex: 1, textAlign: 'left' }}>{item.name}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{item.price}</Text>
          </Row>
          <VerticalSpacer size={10} />
          <Row>
            <Text style={{ flex: 1, textAlign: 'right' }}>
              {item.date.toLocaleDateString()}
            </Text>
          </Row>
          <ToggleWrapper
            style={{
              display: isSelectedItem ? 'flex' : 'none',
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {
                handlePressDelete(item);
              }}
            >
              <Image source={trashcan} style={{ width: 14, height: 14 }} />
              <Text>삭제하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={handlePressEditItem}
            >
              <Image source={edit} style={{ width: 14, height: 14 }} />
              <Text>수정하기</Text>
            </TouchableOpacity>
          </ToggleWrapper>
        </RowWrapper>
      );
    },
    [handlePressDelete, handlePressEditItem, selectedItem?._id],
  );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}
      >
        <View
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            paddingRight: 40,
            paddingLeft: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>총 금액 : {totalPrice}</Text>
        </View>
        <ListWrapper>
          <FlatList
            keyExtractor={(item, index) => {
              return `${item._id.toString()}_${index}`;
            }}
            style={{ padding: 10 }}
            data={tableRow}
            renderItem={renderItem}
          />
        </ListWrapper>
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
          onPress={handlePressAddItem}
        >
          <Text>Add Item!!!</Text>
        </TouchableOpacity>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
        >
          <HomeTableItemForm onPressSubmit={handlePressSubmit} />
        </BottomSheetModal>
        <BottomSheetModal
          ref={bottomSheetUpdateModalRef}
          index={1}
          snapPoints={snapPoints}
        >
          <HomeTableItemUpdateForm
            onPressEdit={handlePressEdit}
            item={selectedItem}
          />
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default Home;
