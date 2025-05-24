import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaceholderImage from '../assets/background.jpg';
import BottomNavBar from '../components/BottomNavBar';
import UserImageDisplay from '../components/UserImageDisplay';
import { useAuth } from '../context/Auth';
import Icon from 'react-native-vector-icons/Octicons';

const Profile = ({ navigation }) => {
  const { userData, logout } = useAuth();

  const getDerivedImageSources = () => {
    if (userData?.photo_urls?.length > 0) {
      return userData.photo_urls.map(url => ({ uri: url }));
    } else {
      return [PlaceholderImage];
    }
  };

  const imageSources = getDerivedImageSources();

  if (!userData) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text>Загрузка данных пользователя...</Text>
      </SafeAreaView>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  const buttonIcons = {
    'Редактировать анкету': 'pencil',
    'Может быть интересно': 'pin',
    'Настройки': 'gear',
    'Поддержка': 'code-of-conduct',
    'Выйти из профиля': 'sign-out',
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserImageDisplay
        imageSources={imageSources}
        userData={userData}
        containerStyle={styles.userImageContainer}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {[
          'Редактировать анкету',
          'Может быть интересно',
          'Настройки',
          'Поддержка',
          'Выйти из профиля',
        ].map((buttonLabel) => (
          <TouchableOpacity
            key={buttonLabel}
            style={styles.button}
            onPress={() => {
              if (buttonLabel === 'Настройки') {
                navigation.navigate('Settings');
              } else if (buttonLabel === 'Выйти из профиля') {
                handleLogout();
              } else if (buttonLabel === 'Поддержка') {
                navigation.navigate('Support');
              } else if (buttonLabel === 'Может быть интересно') {
                navigation.navigate('InterestingArticles');
              }else if (buttonLabel === 'Редактировать анкету') {
                navigation.navigate('ProfileEditing');
              }else {
                console.log(`${buttonLabel} pressed`);
              }
            }}
          >
            <Icon
              name={buttonIcons[buttonLabel]}
              size={20}
              color="#000"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNavBar currentScreen="Profile" activeColor="#FFE4C4" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFE4C4',
    justifyContent: "space-between",
  },
  userImageContainer: {
    marginBottom: 10,
    marginTop: 30,
  },
  button: {
    flexDirection: 'row', // Размещение иконки и текста в строку
    alignItems: 'center', // Выравнивание по центру
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 1,
  },
  icon: {
    marginRight: 10, // Отступ между иконкой и текстом
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Evolventa',
    fontSize: 0.025 * (Dimensions.get('window').height),
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
