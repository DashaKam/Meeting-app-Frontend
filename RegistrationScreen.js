import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
  ImageBackground,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useAuth } from './AuthContext'; // Import useAuth

const RegistrationScreen = ({ navigation }) => {
  const { register } = useAuth(); // Get register function from context
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Состояние для отслеживания фокуса на полях
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Валидация name
  const validateName = (name) => {
    return name.length >= 3;
  };

  // Валидация номера телефона
  const validatePhoneNumber = (phone) => {
    return phone.startsWith('+') && phone.length === 12; // +79XXXXXXXXXX
  };

  // Валидация пароля
  const validatePassword = (password) => {
    return /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password);
  };

  // Обработка отправки формы
  const handleSubmit = async () => {
    let valid = true;

    setNameError('');
    setPhoneError('');
    setPasswordError('');

    if (!validateName(name)) {
      setNameError('Ваше имя слишком короткое :(');
      valid = false;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Номер телефона должен начинаться с + и содержать 11 цифр.');
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('Пароль должен содержать буквы и цифры.');
      valid = false;
    }

    if (!valid) return;

    // Add a loading state if desired
    // setIsLoading(true);
    const success = await register(name, phoneNumber, password);
    // setIsLoading(false);

    if (success) {
      console.log('Registration successful, navigation handled by context.');
      // Navigation is handled by AppNavigator based on AuthContext state
      // navigation.navigate('Profile'); // Usually not needed here
      Alert.alert('Успех', 'Вы успешно зарегистрированы!'); // Keep success alert
    } else {
      Alert.alert(
        'Ошибка',
        'Не удалось зарегистрироваться. Попробуйте еще раз.'
      );
    }
  };

  // Обработка событий клавиатуры
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Обработка фокуса на поле телефона
  const handlePhoneFocus = () => {
    if (!isPhoneFocused) {
      setPhoneNumber('+79');
      setIsPhoneFocused(true);
    }
    // Сброс ошибки при фокусировке
    if (phoneError) {
      setPhoneError('');
    }
  };

  // Обработка фокуса на других полях
  const handleFocusName = () => {
    if (!isNameFocused) {
      setName('');
      setIsNameFocused(true);
    }
    // Сброс ошибки при фокусировке
    if (nameError) {
      setNameError('');
    }
  };

  const handleFocusPassword = () => {
    if (!isPasswordFocused) {
      setPassword('');
      setIsPasswordFocused(true);
    }
    // Сброс ошибки при фокусировке
    if (passwordError) {
      setPasswordError('');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/544.jpg')}
      style={styles.background}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVisible ? 100 : 0}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Скорее регистрируйся!</Text>

          <TextInput
            style={styles.input}
            placeholder="Как тебя зовут?"
            value={name}
            onChangeText={setName}
            onFocus={handleFocusName}
            placeholderTextColor="#CE9FDD"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Оставь свой номерок телефона"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onFocus={handlePhoneFocus}
            placeholderTextColor="#CE9FDD"
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Придумай пароль"
            value={password}
            onChangeText={setPassword}
            onFocus={handleFocusPassword}
            secureTextEntry
            placeholderTextColor="#CE9FDD"
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Уже есть аккаунт? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Скорее заходи!</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>

    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
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

  input: {
    height: 50,
    width: '80%',
    backgroundColor: '#fff',
    color: '#CE9FDD',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: '#645BAA',
    fontSize: 25,
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  linkText: {
    color: '#937EC3',
    fontSize: 16,
  },

  link: {
    color: '#4D3FB7',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10, // Положительный отступ для создания пространства между полем ввода и сообщением об ошибке
    width: '80%', // Ширина сообщения об ошибке равна ширине поля ввода
    textAlign: 'left', // Выравнивание текста по левому краю
  },
});

export default RegistrationScreen;