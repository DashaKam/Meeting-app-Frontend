import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/Auth';
import showAlert from '../utils/alert';
import { validateEmail, validateName, validatePassword, validateUserName } from '../utils/validation';
const RegistrationScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Новое состояние для повторного пароля
  const [nameError, setNameError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // Ошибка для повторного пароля
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Состояние для отслеживания фокуса на полях
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isUserNameFocused, setIsUserNameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Обработка отправки формы
  const handleSubmit = async () => {
    let valid = true;

    setNameError('');
    setUserNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError(''); // Сброс ошибки для повторного пароля

    if (!validateName(name)) {
      setNameError('Ваше имя слишком короткое :(');
      valid = false;
    }

    if (!validateUserName(username)) {
      setUserNameError('Никнейм слишком короткий:(');
      valid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Ваша почта не соответсвует шаблону:(');
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('Пароль должен содержать буквы и цифры.');
      valid = false;
    }

    if (password !== confirmPassword) { // Проверка совпадения паролей
      setConfirmPasswordError('Пароли не совпадают.');
      valid = false;
    }

    if (!valid) return;

    // Add a loading state if desired
    // setIsLoading(true);
    const success = await register(name, username, email, password);
    console.log(success);
    // setIsLoading(false);

    if (success) {
      // Navigation is handled by AppNavigator based on AuthContext state
      // navigation.navigate('Profile'); // Usually not needed here
      showAlert(
        'Успех',
        'Вы успешно зарегистрированы!'
      );
    } else {
      showAlert(
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

  // Обработка фокуса на никнейме
  const handleUserNameFocus = () => {
    if (!isUserNameFocused) {
      setUserName('@');
      setIsUserNameFocused(true);
    }
    // Сброс ошибки при фокусировке
    if (userNameError) {
      setUserNameError('');
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
      source={require('../assets/544.jpg')}
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
            placeholder="Придумай никнейм"
            value={username}
            onChangeText={setUserName}
            onFocus={handleUserNameFocus}
            placeholderTextColor="#CE9FDD"
          />
          {userNameError ? <Text style={styles.errorText}>{userNameError}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Поделись своей электронной почтой"
            value={email}
            onChangeText={setEmail} // Обновление состояния для email
            placeholderTextColor="#CE9FDD"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
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

          <TextInput
            style={styles.input}
            placeholder="Повтори пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#CE9FDD"
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

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

  input: {
    height: 50,
    width: '80%',
    backgroundColor: '#fff',
    color: '#CE9FDD',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 1,
    marginTop: 15,
  },

  button: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 20,
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
    marginBottom: 1,// Положительный отступ для создания пространства между полем ввода и сообщением об ошибке
    width: '80%',// Ширина сообщения об ошибке равна ширине поля ввода
    textAlign: 'left',// Выравнивание текста по левому краю
  },
});

export default RegistrationScreen;