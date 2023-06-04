import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/home/Home';
import { RealmContext } from './model';

const Stack = createNativeStackNavigator();
const { RealmProvider } = RealmContext;
const App = () => {
  return (
    <NavigationContainer>
      <RealmProvider>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </RealmProvider>
    </NavigationContainer>
  );
};

export default App;
