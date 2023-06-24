import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import Realm from 'realm';
import { AppNavigationProp, RouteName } from '../../assets/navigation';

export interface HomeTableItemUpdateFormParams {
  itemId: Realm.BSON.ObjectId;
}

export const useNavigateToHomeTableItemUpdateForm = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return useCallback(
    ({ itemId }: HomeTableItemUpdateFormParams) => {
      navigation.navigate(RouteName.HomeTableItemUpdateForm, { itemId });
    },
    [navigation],
  );
};
