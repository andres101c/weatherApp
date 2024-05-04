import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/AuthScreen';
import ZipScreen from './screens/ZipScreen';
import AuthenticatedScreen from './screens/AuthenticatedScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="AuthScreen">
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ title: 'Login / Signup', }} />
        <Stack.Screen name="AuthenticatedScreen">
          {(props) => <AuthenticatedScreen {...props} user={props.route.params.user} options={{ title: 'Zipcodes', }} />}
        </Stack.Screen>
        <Stack.Screen name="ZipScreen" component={ZipScreen}  />

      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;