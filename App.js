// // // App.js
// // import React from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import LoginScreen from './index'; // or wherever your LoginScreen is located
// // import EmployeeDetailsScreen from './EmployeeDetailsScreen'; // Make sure this path is correct

// // const Stack = createNativeStackNavigator();

// // export default function App() {
// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator initialRouteName="Login">
// //         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
// //         <Stack.Screen name="Details" component={EmployeeDetailsScreen} options={{ title: 'Employee Details' }} />
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }









// // App.js
// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { View, ActivityIndicator } from 'react-native';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';

// import LoginScreen from './index'; // or wherever your LoginScreen is located
// import EmployeeDetailsScreen from './EmployeeDetailsScreen'; // Make sure this path is correct

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   useEffect(() => {
//     async function loadFonts() {
//       try {
//         await Font.loadAsync({
//           Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
//           // You can add more fonts here if needed
//           // 'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
//           // 'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
//         });
//         setFontsLoaded(true);
//       } catch (error) {
//         console.error('Error loading fonts:', error);
//         // Even if fonts fail to load, we should still render the app
//         setFontsLoaded(true);
//       }
//     }
    
//     loadFonts();
//   }, []);

//   // Show loading screen while fonts are loading
//   if (!fontsLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
//         <ActivityIndicator size="large" color="#3498db" />
//         <View style={{ marginTop: 15 }}>
//           <ActivityIndicator size="small" color="#2c3e50" />
//           <View style={{ marginTop: 10 }}>
//             <ActivityIndicator size="small" color="#2c3e50" />
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen 
//           name="Login" 
//           component={LoginScreen} 
//           options={{ 
//             headerShown: false,
//             animation: 'fade',
//           }} 
//         />
//         <Stack.Screen 
//           name="Details" 
//           component={EmployeeDetailsScreen} 
//           options={{ 
//             title: 'Employee Details',
//             headerStyle: {
//               backgroundColor: '#3498db',
//             },
//             headerTintColor: '#fff',
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//             animation: 'slide_from_right',
//           }} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }



// // App.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from './LoginScreen'; // Adjust path as needed
// import EmployeeDetailsScreen from './EmployeeDetailsScreen'; // Adjust path as needed
// //import LiveLocationScreen from './LiveLocationScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen 
//           name="Login" 
//           component={LoginScreen} 
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen 
//           name="Details" 
//           component={EmployeeDetailsScreen} 
//           options={{ title: 'Employee Details' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


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