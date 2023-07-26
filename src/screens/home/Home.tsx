import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { endOfMonth, startOfMonth } from 'date-fns';
import Realm, { Results } from 'realm';
import moment from 'moment';
import { Item } from '../../model/Item';
import { edit, trashcan } from '../../assets/resources/images';
import RealmContext from '../../model';
import HomeTableItemForm from './HomeTableItemForm';
import HomeTableItemUpdateForm from './HomeTableItemUpdateForm';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import { GoalForm } from './GoalForm';
import { MonthPicker } from '../../common/components/MonthPicker';
import { Goal } from '../../model/Goal';
import useMemberUpdate from '../../hooks/useMemberUpdate';
import { useGoalInitialize } from '../../hooks/useGoalInitialize';

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
  padding: 20px;
  flex-direction: row;
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
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    startOfMonth(new Date()),
  );
  const [isOpenMonthPicker, setIsOpenMonthPicker] = useState(false);
  const itemLists = RealmContext.useQuery(Item);
  const realm = RealmContext.useRealm();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetUpdateModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetGoalModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => {
    return ['25%', '50%'];
  }, []);

  const progressBarValue = useRef(new Animated.Value(0)).current;

  const [goal, setGoal] = useState(0);
  const [selectedMonthGoal, setSelectedMonthGoal] = useState<Goal | null>(null);

  const goals: Results<Goal> = RealmContext.useQuery(Goal);

  useMemberUpdate();
  useGoalInitialize();

  const loadProgressBar = useCallback(() => {
    const toValue = totalPrice / goal >= 1 ? 100 : (totalPrice / goal) * 100;
    console.log(toValue);
    Animated.timing(progressBarValue, {
      useNativeDriver: false,
      toValue,
      duration: 500,
    }).start();
  }, [goal, progressBarValue, totalPrice]);

  const progressBarWidth = progressBarValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadProgressBar();
  }, [loadProgressBar]);

  const fetchingData = useCallback(() => {
    setTotalPrice(0);

    const filteredData: Results<Item> = itemLists.filtered(
      'date between { $0, $1 }',
      startOfMonth(selectedMonth),
      endOfMonth(selectedMonth),
    );

    setTableRow(
      filteredData.map((val: Item) => {
        setTotalPrice((prev) => {
          return prev + val.price;
        });
        return val;
      }),
    );
  }, [selectedMonth, itemLists]);

  const fetchingGoalData = useCallback(() => {
    const filteredGoals = goals.filtered(
      'date between { $0, $1 }',
      startOfMonth(selectedMonth),
      endOfMonth(selectedMonth),
    );

    if (filteredGoals.isEmpty()) {
      setGoal(200000);
      realm.write(() => {
        realm.create('Goal', {
          id: new Realm.BSON.ObjectId(),
          date: new Date(),
          goalPrice: 200000,
        });
      });
    } else {
      setGoal(filteredGoals[0].goalPrice);
      setSelectedMonthGoal(filteredGoals[0]);
    }
  }, [goals, realm, selectedMonth]);

  useEffect(() => {
    fetchingData();
    fetchingGoalData();
  }, [fetchingData, fetchingGoalData]);

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

  const handlePressGoal = useCallback(() => {
    bottomSheetGoalModalRef.current?.dismiss();
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
    (newDate: Date) => {
      setIsOpenMonthPicker(false);
      setSelectedMonth(newDate || selectedMonth);
    },
    [selectedMonth],
  );

  const handleRequestClose = useCallback(() => {
    setIsOpenMonthPicker(false);
  }, []);

  const handlePressAddGoal = useCallback(() => {
    bottomSheetGoalModalRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <Wrapper>
        <TouchableOpacity
          style={{ padding: 20, alignItems: 'center' }}
          onPress={handlePressMonthPicker}
        >
          <Text style={{ fontSize: 20 }}>
            {moment(selectedMonth).format('MM-YYYY')}
          </Text>
        </TouchableOpacity>
        {isOpenMonthPicker && (
          <MonthPicker
            isOpenMonthPicker={isOpenMonthPicker}
            onChangeSelectedMonth={handleChangeMonthDate}
            onRequestClose={handleRequestClose}
            selectedMonth={selectedMonth}
          />
        )}
        <TotalPriceWrapper>
          <View style={{ flex: 1 }}>
            <Text
              style={{ textAlign: 'left', fontSize: 15, fontWeight: 'bold' }}
            >
              목표 금액
            </Text>
            <Text style={{ textAlign: 'left', fontSize: 15 }}>{goal}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ textAlign: 'right', fontSize: 15, fontWeight: 'bold' }}
            >
              사용 금액
            </Text>
            <Text style={{ textAlign: 'right', fontSize: 15 }}>
              {totalPrice}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              marginLeft: 30,
              flex: 0.5,
              backgroundColor: 'gray',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handlePressAddGoal}
          >
            <Text style={{ textAlign: 'center' }}>추가</Text>
          </TouchableOpacity>
        </TotalPriceWrapper>
        <View style={{ padding: 20 }}>
          <View
            style={{
              width: '100%',
              height: 8,
              backgroundColor: '#F0F0F0',
              borderRadius: 10,
            }}
          >
            <Animated.View
              style={{
                width: progressBarWidth,
                height: 8,
                backgroundColor: '#AAC9CE',
                borderRadius: 10,
              }}
            />
          </View>
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
        <AddItemButton onPress={handlePressAddItem}>
          <Text>Add Item!!!</Text>
        </AddItemButton>
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
        <KeyboardAvoidingView>
          <BottomSheetModal
            snapPoints={snapPoints}
            ref={bottomSheetGoalModalRef}
            index={1}
          >
            <GoalForm
              selectedMonthGoal={selectedMonthGoal}
              onPressSubmit={handlePressGoal}
            />
          </BottomSheetModal>
        </KeyboardAvoidingView>
      </Wrapper>
    </BottomSheetModalProvider>
  );
};

export default Home;
