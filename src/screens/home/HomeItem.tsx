import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { Item } from '../../model/Item';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import { edit, trashcan } from '../../assets/resources/images';
import { itemRepository } from '../../repository';
import MoreIcon from '../../common/svg/MoreIcon';

const RowWrapper = styled.TouchableOpacity`
  padding: 20px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  position: relative;
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
  flex-direction: column;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
`;

interface HomeItemProps {
  items: Item[] | null;
  onPressItemEditModalOpen: () => void;
  onPressItemRow: (isSelectedItem: boolean, item: Item) => void;
  selectedItem: Item | null;
  onPressItemDelete: (itemId: number) => Promise<void>;
}

export const HomeItem: React.FC<HomeItemProps> = ({
  items,
  onPressItemEditModalOpen,
  onPressItemRow,
  selectedItem,
  onPressItemDelete,
}) => {
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Item>) => {
      const isSelectedItem = selectedItem?.id.toString() === item.id.toString();
      const itemCreatedDateStr = new Date(item.boughtDate).toLocaleDateString();
      return (
        <RowWrapper
          onPress={() => {
            onPressItemRow(isSelectedItem, item);
          }}
        >
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
            <MoreIcon width={20} height={20} fillColor="#121212" />
          </Row>
          <ToggleWrapper
            style={{
              display: isSelectedItem ? 'flex' : 'none',
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {
                onPressItemDelete(item.id);
              }}
            >
              <Image source={trashcan} style={{ width: 14, height: 14 }} />
              <Text>삭제하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={onPressItemEditModalOpen}
            >
              <Image source={edit} style={{ width: 14, height: 14 }} />
              <Text>수정하기</Text>
            </TouchableOpacity>
          </ToggleWrapper>
        </RowWrapper>
      );
    },
    [
      onPressItemDelete,
      onPressItemEditModalOpen,
      onPressItemRow,
      selectedItem?.id,
    ],
  );
  return <FlatList data={items} renderItem={renderItem} />;
};
