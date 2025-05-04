import React, { useState, useEffect  } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet
} from 'react-native';
import { useAuth } from '../context/Auth';
import '../../fonts.css';
import showAlert from "../utils/alert";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [isUserNameFocused, setIsUserNameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validateUserName = (username) => username.length >= 3;
  const validatePassword = (password) => /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password);

  const handleSubmit = async () => {
    let valid = true;
    setUserNameError('');
    setPasswordError('');

    if (!validateUserName(username)) {
      setUserNameError('Никнейм слишком короткий :(');
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('Пароль должен содержать буквы и цифры.');
      valid = false;
    }

    if (!valid) return;

    const success = await login(username, password);
    console.log(success);

    if (success) {
      showAlert(
          'Успех',
          'Вы успешно вошли в аккаунт!'
      );
    }
    else {
      showAlert('Ошибка',
          'Неверный никнейм или пароль. Попробуйте снова!');
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => setKeyboardVisible(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleUserNameFocus = () => {
    if (!isUserNameFocused) {
      setUserName('@');
      setIsUserNameFocused(true);
    }
    if (userNameError) {
      setUserNameError('');
    }
  };

  const handlePasswordFocus = () => {
    if (!isPasswordFocused) {
      setPasswordError('');
      setIsPasswordFocused(true);
    }
    if (passwordError) {
      setPasswordError('');
    }
  };

  return (
      <ImageBackground
          source={require('../assets/background.jpg')}
          style={styles.background}
      >
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardVisible ? 100 : 0}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              Привет!{'\n'}
              Мы скучали, скорее заходи :)
            </Text>

            <TextInput
                style={styles.inputField}
                placeholder="Никнейм"
                value={username}
                onChangeText={setUserName}
                onFocus={handleUserNameFocus}
                placeholderTextColor="#CE9FDD"
            />
            {userNameError ? <Text style={styles.errorText}>{userNameError}</Text> : null}

            <TextInput
                style={styles.inputField}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                onFocus={handlePasswordFocus}
                secureTextEntry
                placeholderTextColor="#CE9FDD"
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Навстречу новым эмоциям</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <Text style={styles.textAboveLink}>Ещё нет аккаунта? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.link}>Скорее регистрируйся!</Text>
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
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Evolventa',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: 400,
    width: 343,
    height: 159,
    flexShrink: 0,
  },

  inputField: {
    width: 298,
    height: 57,
    flexShrink: 0,
    borderRadius: 100,
    backgroundColor: '#D9D9D9',
    fontFamily: 'Evolventa',
    fontSize: 16,
    paddingHorizontal: 23,
    marginBottom: 1,
    marginTop: 15
  },

  input: {
    color: '#CE9FDD',
    textAlign: 'center',
    fontFamily: 'Evolventa',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
  },

  button: {
    width: 168,
    height: 60,
    flexShrink: 0,
    borderRadius: 100,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 9,
    marginTop: 20
  },

  buttonText: {
    width: 130,
    height: 41,
    flexShrink: 0,
    color: '#FAEBFF',
    textAlign: 'center',
    fontFamily: 'Evolventa',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  textAboveLink: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Evolventa',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
  },

  link: {
    color: 'rgba(242,80,231,0.81)',
    textAlign: 'center',
    fontFamily: 'Evolventa',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
    textDecorationLine: 'underline',
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 1,// Положительный отступ для создания пространства между полем ввода и сообщением об ошибке
    width: '80%',// Ширина сообщения об ошибке равна ширине поля ввода
    textAlign: 'center',// Выравнивание текста по центру
  },
});

export default LoginScreen;