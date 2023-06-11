import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/home/Home';
import { RealmContext } from './model';
import HomeTableItemForm from './screens/home/HomeTableItemForm';
import { RouteName } from './assets/navigation';

const Stack = createNativeStackNavigator();
const { RealmProvider } = RealmContext;
const App = () => {
  return (
    <NavigationContainer>
      <RealmProvider>
        <Stack.Navigator>
          <Stack.Screen name={RouteName.Home} component={Home} />
          <Stack.Screen
            name={RouteName.HomeTableItemForm}
            component={HomeTableItemForm}
          />
        </Stack.Navigator>
      </RealmProvider>
    </NavigationContainer>
  );
};

export default App;
