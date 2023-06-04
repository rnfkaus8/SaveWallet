import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createRealmContext } from '@realm/react';
import Home from './screens/home/Home';
import { Item } from './model/Item';

const Stack = createNativeStackNavigator();
const defaultPathLocalRealm = createRealmContext({ schema: [Item] });
const { RealmProvider } = defaultPathLocalRealm;
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
