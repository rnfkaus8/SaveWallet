import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { Item } from '../../model/Item';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import MoreIcon from '../../common/svg/MoreIcon';

const RowWrapper = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 20px;
  background: #f9f9f9;
`;

const Row = styled.View`
  flex: 1;
  flex-direction: row;
`;

const ItemInfo = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
`;

const ToggleWrapper = styled.View`
  border-radius: 8px;
  background: #fff;
  padding: 16px;
  position: absolute;
  top: 7px;
  right: 20px;
  width: 140px;
  z-index: 999;
`;

interface HomeItemProps {
  items: Item[] | null;
  onPressItemEditModalOpen: () => void;
  onPressItemRow: (isSelectedItem: boolean, item: Item) => void;
  selectedItem: Item | null;
  onPressItemDelete: (itemId: number) => void;
}

export const HomeItem: React.FC<HomeItemProps> = ({
  items,
  onPressItemEditModalOpen,
  onPressItemRow,
  selectedItem,
  onPressItemDelete,
}) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Item>) => {
      const isSelectedItem = selectedItem?.id.toString() === item.id.toString();
      return (
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              onPressItemRow(isSelectedItem, item);
            }}
          >
            <RowWrapper>
              <Row>
                <ItemInfo>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Pretendard',
                      fontSize: 16,
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: 24.0,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color: '#757575',
                      fontFamily: 'Pretendard',
                      fontSize: 14,
                      fontStyle: 'normal',
                      fontWeight: '400',
                      lineHeight: 21.0,
                    }}
                  >
                    {moment(item.boughtDate).format('M월 D일')}
                  </Text>
                </ItemInfo>
                <VerticalSpacer size={12} />
                <View style={{ justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: '#121212',
                      fontFamily: 'Pretendard',
                      fontSize: 16,
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: 24.0,
                    }}
                  >
                    {item.price.toLocaleString()}원
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ justifyContent: 'center' }}
                  onPress={() => {
                    onPressItemRow(isSelectedItem, item);
                  }}
                >
                  <MoreIcon width={20} height={20} fillColor="#121212" />
                </TouchableOpacity>
              </Row>
            </RowWrapper>
          </TouchableWithoutFeedback>
          {isSelectedItem && (
            <ToggleWrapper
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 20,
                elevation: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  onPressItemDelete(item.id);
                }}
              >
                <Text
                  style={{
                    color: '#000',
                    fontFamily: 'Pretendard',
                    fontSize: 15,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 22.5,
                  }}
                >
                  삭제하기
                </Text>
              </TouchableOpacity>
              <VerticalSpacer size={8} />
              <TouchableOpacity onPress={onPressItemEditModalOpen}>
                <Text
                  style={{
                    color: '#000',
                    fontFamily: 'Pretendard',
                    fontSize: 15,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 22.5,
                  }}
                >
                  수정하기
                </Text>
              </TouchableOpacity>
            </ToggleWrapper>
          )}
        </View>
      );
    },
    [
      onPressItemDelete,
      onPressItemEditModalOpen,
      onPressItemRow,
      selectedItem?.id,
    ],
  );
  return (
    <FlatList
      style={{ padding: 20 }}
      data={items}
      renderItem={renderItem}
      removeClippedSubviews={false}
      ItemSeparatorComponent={() => {
        return <VerticalSpacer size={12} />;
      }}
    />
  );
};
