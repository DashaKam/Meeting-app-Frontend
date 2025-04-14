import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, Alert } from 'react-native';
import { useAuth } from './AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!validatePhoneNumber(phoneNumber) || !validatePassword(password)) {
      Alert.alert('Ошибка', 'Пожалуйста, введите действительный номер телефона и пароль.');
      return;
    }

    setIsLoading(true);
    const success = await login(phoneNumber, password);
    setIsLoading(false);

    if (success) {
      console.log('Login successful, navigation handled by context.');
    } else {
      Alert.alert(
        'Ошибка входа',
        'Неверный номер телефона или пароль. Попробуйте еще раз.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход!</Text>
      <Text style={styles.message}>Входите!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LoginScreen;