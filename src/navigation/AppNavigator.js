import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../context/Auth';

import LoginScreen from '../screens/Login';
import PeopleSwipeScreen from '../screens/PeopleSwipe';
import ProfileScreen from '../screens/Profile';
import RegistrationScreen from '../screens/Registration';
import SuccessScreen from '../screens/Success';
import SettingsScreen from '../screens/Settings';
import ChangePasswordScreen from '../screens/ChangePassword';
import ChangeNicknameScreen from '../screens/ChangeNickname';
import NotificationsScreen from "../screens/Notification";
import SupportScreen from "../screens/Support";
import InterestingArticlesScreen from "../screens/InterestingArticles";
import ArticleScreen from "../screens/Article";
import InterestScreen from "../screens/Interest";
import ProfileEditingScreen from "../screens/ProfileEditing";



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
      <AppStackNav.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="ChangeNickname" component={ChangeNicknameScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="InterestingArticles" component={InterestingArticlesScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="Article" component={ArticleScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="Interest" component={InterestScreen} options={{ headerShown: false }} />
      <AppStackNav.Screen name="ProfileEditing" component={ProfileEditingScreen} options={{ headerShown: false }} />

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

export default AppNavigator;
