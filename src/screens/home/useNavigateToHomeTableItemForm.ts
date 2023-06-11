import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { AppNavigationProp, RouteName } from '../../assets/navigation';

export const useNavigateToHomeTableItemForm = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return useCallback(() => {
    navigation.navigate(RouteName.HomeTableItemForm);
  }, [navigation]);
};
