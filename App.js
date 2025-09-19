// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen'; // Adjust path as needed
import EmployeeDetailsScreen from './EmployeeDetailsScreen'; // Adjust path as needed
import LiveLocationScreen from './LiveLocationScreen'; // Make sure this import exists

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Details" 
          component={EmployeeDetailsScreen} 
          options={{ title: 'Employee Details' }}
        />
        <Stack.Screen 
          name="LiveLocationScreen" 
          component={LiveLocationScreen} 
          options={{ title: 'Live Location Tracking' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}