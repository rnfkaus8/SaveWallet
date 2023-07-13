import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './screens/home/Home';
import { RouteName } from './assets/navigation';
import RealmContext from './model';
import useMemberUpdate from './hooks/useMemberUpdate';

const Stack = createNativeStackNavigator();
const { RealmProvider } = RealmContext;
const App = () => {
  useMemberUpdate();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RealmProvider>
          <Stack.Navigator>
            <Stack.Screen name={RouteName.Home} component={Home} />
          </Stack.Navigator>
        </RealmProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
