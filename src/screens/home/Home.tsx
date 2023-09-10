import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
import Modal from 'react-native-modal';
import { Item, TotalPriceByCategory } from '../../model/Item';
import HomeTableItemForm from './HomeTableItemForm';
import HomeTableItemUpdateForm from './HomeTableItemUpdateForm';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import { GoalForm } from './GoalForm';
import { Goal, GOAL_TARGET_MONTH_FORMAT } from '../../model/Goal';
import { RootState } from '../../store';
import { MemberState } from '../../states/memberState';
import {
  categoryRepository,
  goalRepository,
  itemRepository,
} from '../../repository';
import { HorizontalSpacer } from '../../common/components/HorizontalSpacer';
import { Category } from '../../model/Category';
import { HomeChart } from './HomeChart';
import { HomeItem } from './HomeItem';
import LeftArrow from '../../common/svg/LeftArrow';
import RightArrow from '../../common/svg/RightArrow';

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: white;
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
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [selectedMonthGoal, setSelectedMonthGoal] = useState<Goal | null>(null);
  const [itemList, setItemList] = useState<Item[] | null>(null);
  const member = useSelector<RootState, MemberState>((state: RootState) => {
    return state.member;
  });
  const [categories, setCategories] = useState<Category[] | null>(null);

  const [pieChartInfo, setPieChartInfo] = useState<{
    series: number[];
    sliceColor: string[];
  }>({ series: [100], sliceColor: ['#467AFF'] });

  const [totalPriceByCategories, setTotalPriceByCategories] = useState<
    TotalPriceByCategory[] | null
  >(null);

  const isLastMonth = useMemo(() => {
    return startOfMonth(selectedMonth) === startOfMonth(new Date());
  }, [selectedMonth]);

  const fetchCategories = useCallback(async () => {
    const categories = await categoryRepository.findByMemberId(member.id);
    setCategories(categories);
  }, [member.id]);

  const fetchItemList = useCallback(async () => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  }, [member.id, selectedMonth]);

  const fetchGoal = useCallback(async () => {
    const findGoal = await goalRepository.findGoalOrSaveWhenNotExist(
      moment(selectedMonth).format(GOAL_TARGET_MONTH_FORMAT),
      200000,
      member.id,
    );
    setSelectedMonthGoal(findGoal);
  }, [member.id, selectedMonth]);

  const fetchTotalPriceByCategory = useCallback(async () => {
    const totalPriceByCategories = await itemRepository.getTotalPriceByCategory(
      member.id,
      startOfDay(startOfMonth(selectedMonth)),
      endOfDay(endOfMonth(selectedMonth)),
    );

    if (!totalPriceByCategories) {
      return;
    }
    if (totalPriceByCategories.length !== 0) {
      let totalPrice = 0;
      setTotalPriceByCategories(totalPriceByCategories);
      totalPriceByCategories.forEach((data) => {
        totalPrice += data.totalPrice;
      });
      const series: number[] = [];
      const sliceColor: string[] = [];
      totalPriceByCategories.forEach((data) => {
        series.push((100 * data.totalPrice) / totalPrice);
        sliceColor.push(data.color);
      });
      setPieChartInfo({ series, sliceColor });
      return;
    }

    setPieChartInfo({ series: [100], sliceColor: ['#467AFF'] });
    setTotalPriceByCategories([]);
  }, [member.id, selectedMonth]);

  const fetchingData = useCallback(async () => {
    await fetchItemList();
    await fetchTotalPriceByCategory();
  }, [fetchItemList, fetchTotalPriceByCategory]);

  useEffect(() => {
    fetchCategories();
    fetchingData();
  }, [fetchCategories, fetchingData]);

  const handlePressDelete = useCallback((itemId: number) => {
    setIsOpenDeleteModal(true);
    setSelectedItemId(itemId);
  }, []);

  const handlePressDeleteItemConfirm = useCallback(async () => {
    if (selectedItemId) {
      await itemRepository.delete(selectedItemId);
      setIsOpenDeleteModal(false);
      await fetchingData();
    }
  }, [fetchingData, selectedItemId]);

  const handlePressAddItemModalOpen = useCallback(() => {
    setIsOpenHomeTableItemForm(true);
  }, []);

  const handlePressSubmitAddItem = useCallback(async () => {
    await fetchingData();
    setIsOpenHomeTableItemForm(false);
  }, [fetchingData]);

  const handleAddItemModalClose = useCallback(() => {
    setIsOpenHomeTableItemForm(false);
  }, []);

  const handlePressEditItemModalOpen = useCallback(() => {
    setIsOpenHomeTableItemUpdateForm(true);
  }, []);

  const handlePressSubmitEditItem = useCallback(async () => {
    await fetchingData();
    setIsOpenHomeTableItemUpdateForm(false);
    setSelectedItem(null);
  }, [fetchingData]);

  const handlePressEditItemModalClose = useCallback(() => {
    setIsOpenHomeTableItemUpdateForm(false);
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
            <LeftArrow width={28} height={28} fillColor="#121212" />
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
            <RightArrow
              width={28}
              height={28}
              fillColor={isLastMonth ? '#121212' : '#BCBCBC'}
            />
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
      {isSelectedGraphTab && (
        <HomeChart
          pieChartInfo={pieChartInfo}
          totalPriceByCategories={totalPriceByCategories}
        />
      )}
      {isSelectedListTab && (
        <HomeItem
          items={itemList}
          onPressItemEditModalOpen={handlePressEditItemModalOpen}
          onPressItemRow={handlePressItemRow}
          onPressItemDelete={handlePressDelete}
          selectedItem={selectedItem}
        />
      )}
      {isOpenHomeTableItemForm && categories && (
        <HomeTableItemForm
          onPressSubmitItem={handlePressSubmitAddItem}
          memberId={member.id}
          categories={categories}
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

      {isOpenDeleteModal && (
        <Modal
          isVisible={isOpenDeleteModal}
          onBackdropPress={() => {
            return setIsOpenDeleteModal(false);
          }}
          onBackButtonPress={() => {
            return setIsOpenDeleteModal(false);
          }}
          style={{ margin: 0 }}
          onSwipeComplete={() => {
            return setIsOpenDeleteModal(false);
          }}
          useNativeDriverForBackdrop
          useNativeDriver
        >
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              height: 176,
              width: 240,
              padding: 20,
              justifyContent: 'flex-end',
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Pretendard',
                fontSize: 17,
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 25.5,
              }}
            >
              삭제하실?
            </Text>
            <VerticalSpacer size={36} />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: '#6A6A6A',
                }}
                onPress={handlePressDeleteItemConfirm}
              >
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Pretendard',
                    fontSize: 15,
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: 22.5,
                  }}
                >
                  네
                </Text>
              </TouchableOpacity>
              <HorizontalSpacer size={8} />
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: '#A6A6A6',
                }}
                onPress={() => {
                  return setIsOpenDeleteModal(false);
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Pretendard',
                    fontSize: 15,
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: 22.5,
                  }}
                >
                  아니
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <ActionButton
        onPress={handlePressAddItemModalOpen}
        buttonColor="rgba(173, 173, 173, 1)"
      />
    </Wrapper>
  );
};

export default Home;
