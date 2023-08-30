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
import ActionButton from 'react-native-action-button';
import PieChart from 'react-native-pie-chart';
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
import { Goal, GOAL_TARGET_MONTH_FORMAT } from '../../model/Goal';
import { RootState } from '../../store';
import { MemberState } from '../../states/memberState';
import { goalRepository, itemRepository } from '../../repository';
import { HorizontalSpacer } from '../../common/components/HorizontalSpacer';

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
`;

const PriceWrapper = styled.View`
  display: flex;
  padding: 0 4px;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
  flex-direction: row;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const TabWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: stretch;
`;

const Tab = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: ${(props) => {
    return props.isSelected ? '#424242' : '#ECECEC';
  }};
`;

const HeaderWrapper = styled.View``;

const MonthWrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const Home = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    startOfMonth(new Date()),
  );

  const [isSelectedGraphTab, setIsSelectedGraphTab] = useState(true);
  const [isSelectedListTab, setIsSelectedListTab] = useState(false);

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
    let totalPrice = 0;
    items?.forEach((item) => {
      totalPrice += item.price;
    });
    setTotalPrice(totalPrice);
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

  const handlePressTab = useCallback((isSelectGraphTab: boolean) => {
    if (isSelectGraphTab) {
      setIsSelectedGraphTab(true);
      setIsSelectedListTab(false);
      return;
    }
    setIsSelectedGraphTab(false);
    setIsSelectedListTab(true);
  }, []);

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
            {moment(selectedMonth).format('M')}월 소비
          </Text>
          <TouchableOpacity onPress={handlePressPlusMonth}>
            <Image source={roundArrowRight} width={28} height={28} />
          </TouchableOpacity>
        </MonthWrapper>
      </HeaderWrapper>
      <VerticalSpacer size={48} />
      <TabWrapper>
        <Tab
          isSelected={isSelectedGraphTab}
          onPress={() => {
            return handlePressTab(true);
          }}
        >
          <Text
            style={{
              color: isSelectedGraphTab ? '#fff' : '#797979',
              fontFamily: 'Pretendard',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 22.4,
            }}
          >
            소비 그래프
          </Text>
        </Tab>
        <HorizontalSpacer size={12} />
        <Tab
          isSelected={isSelectedListTab}
          onPress={() => {
            return handlePressTab(false);
          }}
        >
          <Text
            style={{
              color: isSelectedListTab ? '#fff' : '#797979',
              fontFamily: 'Pretendard',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 22.4,
            }}
          >
            소비 목록
          </Text>
        </Tab>
      </TabWrapper>
      <VerticalSpacer size={48} />
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <PieChart
          widthAndHeight={280}
          series={[50, 30, 20]}
          sliceColor={['#467AFF', '#FFD542', '#FF5757']}
          coverRadius={0.5}
        />
      </View>
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
      <ActionButton
        onPress={handlePressAddItemModalOpen}
        buttonColor="rgba(173, 173, 173, 1)"
      />
    </Wrapper>
  );
};

export default Home;
