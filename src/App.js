import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthProvider, useAuth } from './context/Auth';

import LoginScreen from './screens/Login';
import PeopleSwipeScreen from './screens/PeopleSwipe';
import ProfileScreen from './screens/Profile';
import RegistrationScreen from './screens/Registration';
import SuccessScreen from './screens/Success';

const AuthStackNav = createNativeStackNavigator();
const AppStackNav = createNativeStackNavigator();

// Non-authenticated users
const AuthStack = () => (
  <AuthStackNav.Navigator initialRouteName="Registration">
    <AuthStackNav.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <AuthStackNav.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
  </AuthStackNav.Navigator>
);

// Authenticated users
const AppStack = () => (
  <AppStackNav.Navigator initialRouteName="Profile">
    <AppStackNav.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <AppStackNav.Screen name="Success" component={SuccessScreen} options={{ headerShown: false }} />
    <AppStackNav.Screen name="PeopleSwipe" component={PeopleSwipeScreen} options={{ headerShown: false }} />
    {/* Add other authenticated screens here */}
  </AppStackNav.Navigator>
);

const AppNavigator = () => {
  const { accessToken, isLoading } = useAuth();
  return (
    <NavigationContainer>
      {accessToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;