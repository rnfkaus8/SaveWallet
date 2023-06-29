import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './screens/home/Home';
import { RouteName } from './assets/navigation';
import RealmContext from './model';

const Stack = createNativeStackNavigator();
const { RealmProvider } = RealmContext;
const App = () => {
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
