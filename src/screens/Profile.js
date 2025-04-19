import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaceholderImage from '../assets/544.jpg';
import BottomNavBar from '../components/BottomNavBar';
import UserImageDisplay from '../components/UserImageDisplay';
import { useAuth } from '../context/Auth';

const ProfileScreen = () => {
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
                    'Избранные мероприятия',
                    'Мероприятия',
                    'Может быть интересно',
                    'Темная тема???',
                    'Связаться с поддержкой',
                    'Выйти из профиля',
                ].map((buttonLabel) => (
                    <TouchableOpacity
                        key={buttonLabel}
                        style={styles.button}
                        onPress={buttonLabel === 'Выйти из профиля' ? handleLogout : () => console.log(`${buttonLabel} pressed`)}
                    >
                        <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <BottomNavBar currentScreen="Profile" />
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
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: 1,
    },
    buttonText: {
        color: '#000',
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

export default ProfileScreen;