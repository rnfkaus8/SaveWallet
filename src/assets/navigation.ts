import { NavigationProp } from '@react-navigation/native';

export enum RouteName {
  Home = '홈',
  HomeTableItemForm = '구매 내역 등록',
}

export type AppRouteParams = Record<RouteName, unknown>;
export type AppNavigationProp = NavigationProp<AppRouteParams>;
