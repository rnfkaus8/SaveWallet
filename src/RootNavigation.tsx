import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteName } from './assets/navigation';
import { Login } from './screens/member/Login';
import Home from './screens/home/Home';
import { Member } from './model/Member';
import { memberFetched } from './states/memberState';
import { RootState } from './store';
import { useAppInitialize } from './hooks/useAppInitialize';

export const RootNavigation = () => {
  useAppInitialize();

  const isAuthInitialize = useSelector<RootState, boolean>((state) => {
    return state.auth.isAuthInitialize;
  });

  const handleNavigationContainerReady = useCallback(() => {
    RNBootSplash.hide();
  }, []);
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer onReady={handleNavigationContainerReady}>
      <Stack.Navigator>
        {!isAuthInitialize && (
          <Stack.Screen name={RouteName.Login} component={Login} />
        )}
        <Stack.Screen name={RouteName.Home} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
