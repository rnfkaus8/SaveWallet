import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteName } from './assets/navigation';
import Home from './screens/home/Home';
import { useAppInitialize } from './hooks/useAppInitialize';

export const RootNavigation = () => {
  useAppInitialize();

  const handleNavigationContainerReady = useCallback(() => {
    RNBootSplash.hide();
  }, []);
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer onReady={handleNavigationContainerReady}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name={RouteName.Home}
          component={Home}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
