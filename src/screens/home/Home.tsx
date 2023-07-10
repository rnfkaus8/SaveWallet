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
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Results } from 'realm';
import MonthPicker, { EventTypes } from 'react-native-month-year-picker';
import moment from 'moment';
import { Item } from '../../model/Item';
import { edit, trashcan } from '../../assets/resources/images';
import RealmContext from '../../model';
import HomeTableItemForm from './HomeTableItemForm';
import HomeTableItemUpdateForm from './HomeTableItemUpdateForm';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import { GoalForm } from './GoalForm';

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

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: white;
  position: relative;
`;

const TotalPriceWrapper = styled.View`
  padding: 20px 40px;
  justify-content: center;
  align-items: center;
`;

const AddItemButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: gray;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const [tableRow, setTableRow] = useState<Item[]>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [isOpenMonthPicker, setIsOpenMonthPicker] = useState(false);
  const itemLists = RealmContext.useQuery(Item);
  const realm = RealmContext.useRealm();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetUpdateModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetGoalModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => {
    return ['25%', '50%'];
  }, []);

  const fetchingData = useCallback(() => {
    setTotalPrice(0);

    const filteredData: Results<Item> = itemLists.filtered(
      'date between { $0, $1 }',
      startOfMonth(date),
      endOfMonth(date),
    );

    setTableRow(
      filteredData.map((val: Item) => {
        setTotalPrice((prev) => {
          return prev + val.price;
        });
        return val;
      }),
    );
  }, [date, itemLists]);

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

  const handlePressItemRow = useCallback(
    (isSelectedItem: boolean, item: Item) => {
      bottomSheetUpdateModalRef.current?.dismiss();
      if (isSelectedItem) {
        setSelectedItem(null);
        return;
      }
      setSelectedItem(item);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Item>) => {
      const isSelectedItem =
        selectedItem?._id.toString() === item._id.toString();
      return (
        <RowWrapper
          onPress={() => {
            handlePressItemRow(isSelectedItem, item);
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
    [
      handlePressDelete,
      handlePressEditItem,
      handlePressItemRow,
      selectedItem?._id,
    ],
  );

  const handlePressMonthPicker = useCallback(() => {
    setIsOpenMonthPicker(true);
  }, []);

  const handleChangeMonthDate = useCallback(
    (event: EventTypes, newDate: Date) => {
      setIsOpenMonthPicker(false);
      setDate(newDate || date);
    },
    [date],
  );

  return (
    <BottomSheetModalProvider>
      <Wrapper>
        <TouchableOpacity
          style={{ padding: 20, alignItems: 'center' }}
          onPress={handlePressMonthPicker}
        >
          <Text style={{ fontSize: 20 }}>{moment(date).format('MM-YYYY')}</Text>
        </TouchableOpacity>
        {isOpenMonthPicker && (
          <MonthPicker
            value={date}
            onChange={handleChangeMonthDate}
            locale="ko"
          />
        )}
        <TotalPriceWrapper>
          <Text>총 금액 : {totalPrice}</Text>
        </TotalPriceWrapper>
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
        <AddItemButton onPress={handlePressAddItem}>
          <Text>Add Item!!!</Text>
        </AddItemButton>
        <KeyboardAvoidingView>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
          >
            <HomeTableItemForm onPressSubmit={handlePressSubmit} />
          </BottomSheetModal>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
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
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <BottomSheetModal
            snapPoints={snapPoints}
            ref={bottomSheetGoalModalRef}
            index={1}
          >
            <GoalForm />
          </BottomSheetModal>
        </KeyboardAvoidingView>
      </Wrapper>
    </BottomSheetModalProvider>
  );
};

export default Home;
