import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
} from 'react-native';
import { addDays, eachMonthOfInterval, startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import moment from 'moment/moment';
import { MemberState } from '../../states/memberState';
import { RootState } from '../../store';

interface MonthPickerProps {
  isOpenMonthPicker: boolean;
  onRequestClose(): void;
  onChangeSelectedMonth(month: Date): void;
  selectedMonth: Date;
}

const MONTH_PICKER_ITEM_HEIGHT = 50;

const MonthPickerButton = styled.TouchableOpacity`
  height: ${MONTH_PICKER_ITEM_HEIGHT}px;
  justify-content: center;
`;

const Wrapper = styled.View`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
  padding: 20px;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

export const MonthPicker: React.FC<MonthPickerProps> = ({
  isOpenMonthPicker,
  onRequestClose,
  onChangeSelectedMonth,
  selectedMonth,
}) => {
  const member = useSelector<RootState, MemberState>((state: RootState) => {
    return state.member;
  });

  const months = useMemo(() => {
    const today = startOfDay(new Date());
    return eachMonthOfInterval({
      start: new Date(member.createdAt),
      end: addDays(today, 1),
    })
      .map((date) => {
        return startOfDay(date);
      })
      .reverse();
  }, [member]);

  const handlePressMonthPickerItem = useCallback(
    (month: Date) => {
      onChangeSelectedMonth(month);
      onRequestClose();
    },
    [onChangeSelectedMonth, onRequestClose],
  );

  const getItemLayout = useCallback(
    (data: ArrayLike<Date> | null | undefined, index: number) => {
      return {
        length: MONTH_PICKER_ITEM_HEIGHT,
        offset: MONTH_PICKER_ITEM_HEIGHT * index,
        index,
      };
    },
    [],
  );

  const scrollIndex = useMemo(() => {
    if (isOpenMonthPicker) {
      const index = months.findIndex((month) => {
        return month.valueOf() === selectedMonth.valueOf();
      });
      return index >= 3 ? index - 3 : 0;
    }

    return 0;
  }, [isOpenMonthPicker, months, selectedMonth]);

  const renderItem = useCallback(
    (info: ListRenderItemInfo<Date>) => {
      const isSelected = info.item.valueOf() === selectedMonth.valueOf();
      return (
        <MonthPickerButton
          key={info.item.toString()}
          onPress={() => {
            return handlePressMonthPickerItem(info.item);
          }}
        >
          <Text
            style={{
              color: isSelected ? 'black' : 'gray',
              fontWeight: isSelected ? 'bold' : 'normal',
            }}
          >
            {moment(info.item).format('MM-YYYY')}
          </Text>
        </MonthPickerButton>
      );
    },
    [handlePressMonthPickerItem, selectedMonth],
  );

  return (
    <Modal
      isVisible={isOpenMonthPicker}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      onSwipeComplete={onRequestClose}
      useNativeDriverForBackdrop
      useNativeDriver
      swipeDirection="down"
      propagateSwipe={months.length > 7}
    >
      <Wrapper>
        <HeaderWrapper>
          <Text style={{ flex: 1, fontSize: 15, fontWeight: 'bold' }}>
            월 선택하기
          </Text>
          <TouchableOpacity
            onPress={onRequestClose}
            style={{ padding: 8, margin: -8 }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>X</Text>
          </TouchableOpacity>
        </HeaderWrapper>
        <FlatList
          data={months}
          style={{ minHeight: 100, maxHeight: 400 }}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialScrollIndex={scrollIndex}
        />
      </Wrapper>
    </Modal>
  );
};
