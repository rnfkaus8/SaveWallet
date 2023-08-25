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
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {
  addMonths,
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Item } from '../../model/Item';
import {
  edit,
  roundArrowLeft,
  roundArrowRight,
  trashcan,
} from '../../assets/resources/images';
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
  padding: 24px 20px;
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
  justify-content: center;
  align-items: flex-start;
  align-items: stretch;
`;

const PriceWrapper = styled.View`
  display: flex;
  padding: 0px 4px;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
  flex-direction: row;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const GoalWrapper = styled.TouchableOpacity`
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

const HeaderWrapper = styled.View`
  padding: 24px;
`;

const MonthWrapper = styled.View`
  align-items: center;
  flex-direction: row;
`;

const Home = () => {
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
    items?.forEach((item) => {
      setTotalPrice((prev) => {
        return prev + item.price;
      });
    });
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

  const handlePressMinusMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      return subMonths(prev, 1);
    });
  }, []);

  const handlePressPlusMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      return addMonths(prev, 1);
    });
  }, []);

  const listEmptyComponent = useMemo(() => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'right',
            color: '#555',
            fontFamily: 'Pretendard',
            fontSize: 15,
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: 22.5,
          }}
        >
          아직 등록 된 소비 목록이 없어요.
        </Text>
      </View>
    );
  }, []);
  const listHeaderComponent = useMemo(() => {
    return (
      <Text
        style={{
          color: '#555',
          fontFamily: 'Pretendard',
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: 21,
        }}
      >
        내 소비 목록
      </Text>
    );
  }, []);

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
      <HeaderWrapper>
        <MonthWrapper>
          <TouchableOpacity onPress={handlePressMinusMonth}>
            <Image source={roundArrowLeft} width={28} height={28} />
          </TouchableOpacity>
          <Text
            style={{
              color: '#121212',
              fontFamily: 'Pretendard',
              fontSize: 18,
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 25.2,
            }}
          >
            {moment(selectedMonth).month()}월 소비
          </Text>
          <TouchableOpacity onPress={handlePressPlusMonth}>
            <Image source={roundArrowRight} width={28} height={28} />
          </TouchableOpacity>
        </MonthWrapper>
        <TotalPriceWrapper>
          <Text
            style={{
              color: '#888',
              fontFamily: 'Pretendard',
              fontSize: 15,
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: 22.5,
            }}
          >
            총 소비 금액
          </Text>
          <PriceWrapper>
            <Text
              style={{
                color: '#121212',
                fontFamily: 'Pretendard',
                fontSize: 28,
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: 42,
              }}
            >
              {totalPrice.toLocaleString()}원
            </Text>
            <GoalWrapper onPress={handlePressGoalFormModalOpen}>
              <Text
                style={{
                  textAlign: 'right',
                  color: '#888',
                  fontFamily: 'Pretendard',
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: 24,
                }}
              >
                {goalPrice.toLocaleString()}원 {'>'}
              </Text>
            </GoalWrapper>
          </PriceWrapper>
          <View
            style={{
              width: '100%',
              height: 22,
              backgroundColor: '#C1C1C1',
              borderRadius: 8,
            }}
          >
            <Animated.View
              style={{
                width: progressBarWidth,
                height: 22,
                backgroundColor: '#ECECEC',
                borderRadius: 8,
              }}
            />
          </View>
        </TotalPriceWrapper>
      </HeaderWrapper>
      <View style={{ backgroundColor: '#F4F4F4', height: 8 }} />
      <ListWrapper>
        <FlatList
          keyExtractor={(item, index) => {
            return `${item.id.toString()}_${index}`;
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={itemList}
          renderItem={renderItem}
          ListHeaderComponent={listHeaderComponent}
          ListHeaderComponentStyle={{ marginBottom: 12 }}
          ListEmptyComponent={listEmptyComponent}
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
