import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons'; // Импортируйте иконки

const SettingsScreen = ({ navigation }) => {
    const buttonIcons = {
        'Изменить пароль': 'pencil',
        'Изменить никнейм': 'pencil',
        'Уведомления': 'bell',
        'Удалить аккаунт': 'trash',
        'Темная тема': 'moon',
    };
    const screenNames = {
        'Изменить пароль': 'ChangePassword',
        'Изменить никнейм': 'ChangeNickname',
        'Уведомления': 'Notifications',
        'Удалить аккаунт': 'DeleteAccount',
        'Темная тема': 'DarkMode',
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Верхняя панель с текстом "Настройки" и кнопкой "Назад" */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Octicons name="chevron-left" size={24} color="#000" />
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
                ].map((buttonLabel) => {
                    const screenName = screenNames[buttonLabel]; // Получаем имя экрана из маппинга
                    return (
                        <TouchableOpacity
                            key={buttonLabel}
                            style={styles.button}
                            onPress={() => navigation.navigate(screenName)}
                        >
                            <Octicons
                                name={buttonIcons[buttonLabel]}
                                size={20}
                                color="#000"
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>{buttonLabel}</Text>
                        </TouchableOpacity>
                    );
                })}
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
        fontFamily: 'Arial', // Используйте стандартный шрифт
        color: '#000',
        marginLeft: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: 1,
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#000',
        fontFamily: 'Arial', // Используйте стандартный шрифт
        fontSize: 0.025 * (Dimensions.get('window').height),
    },
});

export default SettingsScreen;