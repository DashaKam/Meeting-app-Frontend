import React from 'react';
import { AuthProvider } from './context/Auth';
import AppNavigator from './navigation/AppNavigator';


const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;