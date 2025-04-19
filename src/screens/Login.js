import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/Auth';
import { validatePassword, validateUserName } from '../utils/validation';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!validateUserName(username) || !validatePassword(password)) {
      Alert.alert('Ошибка', 'Пожалуйста, введите действительный никнейм и пароль.');
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);

    if (success) {
      console.log('Login successful, navigation handled by context.');
    } else {
      Alert.alert(
        'Ошибка входа',
        'Неверный никнейм или пароль. Попробуйте еще раз.'
      );
    }
  };

  // TODO: Добавить нормальную верстку и нормальную валидацию
  //       Временное решение, чтобы было удобно входить для тестирования
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Вход!</Text>
      <Text style={styles.message}>Входите!</Text>
      <TextInput
        // style={styles.input}
        placeholder="Введите никнейм"
        value={username}
        onChangeText={setUserName}
        // onFocus={handleUserNameFocus}
        placeholderTextColor="#CE9FDD"
      />
      <TextInput
        // style={styles.input}
        placeholder="Введите пароль"
        value={password}
        onChangeText={setPassword}
        // onFocus={handleFocusPassword}
        secureTextEntry
        placeholderTextColor="#CE9FDD"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Вход</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Еще нет аккаунта? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.link}>Скорее регистрируйся!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    padding: 16,
  },

  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
  },

  title: {
    fontSize: 40,
    fontWeight: 'regular',
    textAlign: 'center',
    textbackgroundColor: '#ccc',
    marginBottom: 16,
    color: '#645BAA',
  },

  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LoginScreen;