import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import Home from './screens/home/Home';
import { RouteName } from './assets/navigation';
import { store } from './store';
import { Login } from './screens/member/Login';

const Stack = createNativeStackNavigator();
const App = () => {
  const handleNavigationContainerReady = useCallback(() => {
    RNBootSplash.hide();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer onReady={handleNavigationContainerReady}>
          <Stack.Navigator>
            <Stack.Screen name={RouteName.Login} component={Login} />
            <Stack.Screen name={RouteName.Home} component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
