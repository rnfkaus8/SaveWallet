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
import { Item } from '../../model/Item';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';
import { edit, trashcan } from '../../assets/resources/images';
import { itemRepository } from '../../repository';

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
