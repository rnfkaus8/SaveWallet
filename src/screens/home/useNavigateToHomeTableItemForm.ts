import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { AppNavigationProp, RouteName } from '../../assets/navigation';
import { Item } from '../../model/Item';

export interface HomeTableItemFormParams {
  item?: Item;
}

export const useNavigateToHomeTableItemForm = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return useCallback(
    ({ item }: HomeTableItemFormParams) => {
      navigation.navigate(RouteName.HomeTableItemForm, { item });
    },
    [navigation],
  );
};
