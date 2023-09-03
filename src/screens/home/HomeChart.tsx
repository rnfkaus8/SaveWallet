import PieChart from 'react-native-pie-chart';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { TotalPriceByCategory } from '../../model/Item';
import { HorizontalSpacer } from '../../common/components/HorizontalSpacer';
import { VerticalSpacer } from '../../common/components/VerticalSpacer';

interface HomeChartProps {
  pieChartInfo: {
    series: number[];
    sliceColor: string[];
  };
  totalPriceByCategories: TotalPriceByCategory[] | null;
}

export const HomeChart: React.FC<HomeChartProps> = ({
  pieChartInfo,
  totalPriceByCategories,
}) => {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<TotalPriceByCategory>) => {
      return (
        <>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: pieChartInfo.sliceColor[index],
                width: 12,
                height: 12,
                alignSelf: 'center',
                alignItems: 'flex-start',
              }}
            />
            <HorizontalSpacer size={10} />
            <Text
              style={{
                flex: 1,
                color: '#121212',
                fontFamily: 'Pretendard',
                fontSize: 15,
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: 22.5,
                alignItems: 'flex-start',
              }}
            >
              {item.categoryName}
            </Text>
            <Text
              style={{
                flex: 1,
                color: '#888',
                fontFamily: 'Pretendard',
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: 21,
                textAlign: 'right',
              }}
            >
              {item.totalPrice.toLocaleString()}원
            </Text>
          </View>
          <VerticalSpacer size={10} />
        </>
      );
    },
    [pieChartInfo.sliceColor],
  );

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <PieChart
        widthAndHeight={280}
        series={pieChartInfo.series}
        sliceColor={pieChartInfo.sliceColor}
        coverRadius={0.5}
      />
      <VerticalSpacer size={48} />
      <FlatList
        style={{ width: '100%', paddingStart: 24, paddingEnd: 24 }}
        data={totalPriceByCategories}
        renderItem={renderItem}
      />
    </View>
  );
};
