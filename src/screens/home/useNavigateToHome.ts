import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { AppNavigationProp, RouteName } from '../../assets/navigation';

export const useNavigateToHome = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return useCallback(() => {
    navigation.navigate(RouteName.Home);
  }, [navigation]);
};
