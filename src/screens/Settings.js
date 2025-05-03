import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaceholderImage from '../assets/background.jpg';
import { useAuth } from '../context/Auth';
import Icon from 'react-native-vector-icons/Octicons';

const SettingsScreen = ({ navigation }) => {
    const { userData, logout } = useAuth();

    // Функция выхода из аккаунта
    const handleLogout = async () => {
        await logout();
    };

    // Маппинг иконок для кнопок
    const buttonIcons = {
        'Изменить пароль': 'pencil',
        'Изменить никнейм': 'pencil',
        'Уведомления': 'bell',
        'Удалить аккаунт': 'trash',
        'Темная тема': 'moon',
    };



    return (
        <SafeAreaView style={styles.container}>
            {/* Верхняя панель с текстом "Настройки" и кнопкой "Назад" */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Настройки</Text>
            </View>

            {/* Контент */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {[
                    'Изменить пароль',
                    'Изменить никнейм',
                    'Уведомления',
                    'Удалить аккаунт',
                    'Темная тема',
                ].map((buttonLabel) => (
                    <TouchableOpacity
                        key={buttonLabel}
                        style={styles.button}
                        onPress={() => navigation.navigate(buttonLabel.replace(' ', ''))} // Убираем пробелы из названия экрана
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFE4C4',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Evolventa',
        color: '#000',
        marginLeft: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
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
});

export default SettingsScreen;