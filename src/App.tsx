import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import Home from './screens/home/Home';
import { RouteName } from './assets/navigation';
import RealmContext from './model';
import useMemberUpdate from './hooks/useMemberUpdate';
import { useGoalInitialize } from './hooks/useGoalInitialize';
import { store } from './store';

const Stack = createNativeStackNavigator();
const { RealmProvider } = RealmContext;
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <RealmProvider>
            <Stack.Navigator>
              <Stack.Screen name={RouteName.Home} component={Home} />
            </Stack.Navigator>
          </RealmProvider>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
