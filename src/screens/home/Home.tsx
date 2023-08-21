import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Item } from '../../model/Item';
import { edit, trashcan } from '../../assets/resources/images';
import HomeTableItemForm from './HomeTableItemForm';
import HomeTableItemUpdateForm from './HomeTableItemUpdateForm';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import { GoalForm } from './GoalForm';
import { MonthPicker } from '../../common/components/MonthPicker';
import { Goal, GOAL_TARGET_MONTH_FORMAT } from '../../model/Goal';
import { RootState } from '../../store';
import { MemberState } from '../../states/memberState';
import { goalRepository, itemRepository } from '../../repository';

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
  const [isOpenHomeTableItemForm, setIsOpenHomeTableItemForm] = useState(false);
  const [isOpenHomeTableItemUpdateForm, setIsOpenHomeTableItemUpdateForm] =
    useState(false);
  const [isOpenGoalForm, setIsOpenGoalForm] = useState(false);

  const progressBarValue = useRef(new Animated.Value(0)).current;

  const [goalPrice, setGoalPrice] = useState(0);
  const [selectedMonthGoal, setSelectedMonthGoal] = useState<Goal | null>(null);
  const [itemList, setItemList] = useState<Item[] | null>(null);
  const member = useSelector<RootState, MemberState>((state: RootState) => {
    return state.member;
  });

  const fetchItemList = useCallback(async () => {
    const items = await itemRepository.getItemList(
      member.id,
      startOfDay(startOfMonth(selectedMonth)),
      endOfDay(endOfMonth(selectedMonth)),
    );
    setItemList(items);
    setTableRow(
      items?.map((val: Item) => {
        setTotalPrice((prev) => {
          return prev + val.price;
        });
        return val;
      }),
    );
  }, [member.id, selectedMonth]);

  const fetchGoal = useCallback(async () => {
    const findGoal = await goalRepository.findGoalOrSaveWhenNotExist(
      moment(selectedMonth).format(GOAL_TARGET_MONTH_FORMAT),
      200000,
      member.id,
    );
    setGoalPrice(findGoal.goalPrice);
    setSelectedMonthGoal(findGoal);
  }, [member.id, selectedMonth]);

  useEffect(() => {
    setTotalPrice(0);
    fetchItemList();
    fetchGoal();
  }, [fetchGoal, fetchItemList]);

  const loadProgressBar = useCallback(() => {
    const toValue =
      totalPrice / goalPrice >= 1 ? 100 : (totalPrice / goalPrice) * 100;
    Animated.timing(progressBarValue, {
      useNativeDriver: false,
      toValue,
      duration: 500,
    }).start();
  }, [goalPrice, progressBarValue, totalPrice]);

  const progressBarWidth = progressBarValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadProgressBar();
  }, [loadProgressBar]);

  const handlePressDelete = useCallback(
    async (itemId: number) => {
      await itemRepository.delete(itemId);
      setTotalPrice(0);
      await fetchItemList();
    },
    [fetchItemList],
  );

  const handlePressItemRow = useCallback(
    (isSelectedItem: boolean, item: Item) => {
      if (isSelectedItem) {
        setSelectedItem(null);
        return;
      }
      setSelectedItem(item);
    },
    [],
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

  const handleMonthPickerClose = useCallback(() => {
    setIsOpenMonthPicker(false);
  }, []);

  const handlePressAddItemModalOpen = useCallback(() => {
    setIsOpenHomeTableItemForm(true);
  }, []);

  const handlePressSubmitAddItem = useCallback(async () => {
    setTotalPrice(0);
    await fetchItemList();
    setIsOpenHomeTableItemForm(false);
  }, [fetchItemList]);

  const handleAddItemModalClose = useCallback(() => {
    setIsOpenHomeTableItemForm(false);
  }, []);

  const handlePressEditItemModalOpen = useCallback(() => {
    setIsOpenHomeTableItemUpdateForm(true);
  }, []);

  const handlePressSubmitEditItem = useCallback(async () => {
    setTotalPrice(0);
    await fetchItemList();
    setIsOpenHomeTableItemUpdateForm(false);
    setSelectedItem(null);
  }, [fetchItemList]);

  const handlePressEditItemModalClose = useCallback(() => {
    setIsOpenHomeTableItemUpdateForm(false);
  }, []);

  const handlePressGoalFormModalOpen = useCallback(() => {
    setIsOpenGoalForm(true);
  }, []);

  const handlePressUpdateGoal = useCallback(async () => {
    await fetchGoal();
    setIsOpenGoalForm(false);
  }, [fetchGoal]);

  const handlePressGoalFormModalClose = useCallback(() => {
    setIsOpenGoalForm(false);
  }, []);

  const handlePressAddGoal = useCallback(() => {}, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Item>) => {
      const isSelectedItem = selectedItem?.id.toString() === item.id.toString();
      const itemCreatedDateStr = new Date(item.boughtDate).toLocaleDateString();
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
              {itemCreatedDateStr}
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
                handlePressDelete(item.id);
              }}
            >
              <Image source={trashcan} style={{ width: 14, height: 14 }} />
              <Text>삭제하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={handlePressEditItemModalOpen}
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
      handlePressEditItemModalOpen,
      handlePressItemRow,
      selectedItem?.id,
    ],
  );

  return (
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
          onRequestClose={handleMonthPickerClose}
          selectedMonth={selectedMonth}
        />
      )}
      <TotalPriceWrapper>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'left', fontSize: 15, fontWeight: 'bold' }}>
            목표 금액
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 15 }}>{goalPrice}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ textAlign: 'right', fontSize: 15, fontWeight: 'bold' }}
          >
            사용 금액
          </Text>
          <Text style={{ textAlign: 'right', fontSize: 15 }}>{totalPrice}</Text>
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
            return `${item.id.toString()}_${index}`;
          }}
          style={{ padding: 10 }}
          data={tableRow}
          renderItem={renderItem}
        />
      </ListWrapper>
      <AddItemButton onPress={handlePressAddItemModalOpen}>
        <Text>Add Item!!!</Text>
      </AddItemButton>
      {isOpenHomeTableItemForm && (
        <HomeTableItemForm
          onPressSubmitItem={handlePressSubmitAddItem}
          memberId={member.id}
          isOpenHomeTableItemForm={isOpenHomeTableItemForm}
          onRequestClose={handleAddItemModalClose}
        />
      )}
      {isOpenHomeTableItemUpdateForm && (
        <HomeTableItemUpdateForm
          onPressEdit={handlePressSubmitEditItem}
          item={selectedItem}
          isOpenHomeTableItemUpdateForm={isOpenHomeTableItemUpdateForm}
          onRequestClose={handlePressEditItemModalClose}
        />
      )}

      {isOpenGoalForm && (
        <GoalForm
          selectedMonthGoal={selectedMonthGoal}
          onPressSubmit={handlePressUpdateGoal}
          isOpenGoalForm={isOpenGoalForm}
          onRequestClose={handlePressGoalFormModalClose}
        />
      )}
    </Wrapper>
  );
};

export default Home;
