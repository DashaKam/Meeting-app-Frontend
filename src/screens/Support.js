import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';

const SupportScreen = ({ navigation }) => {
    const [message, setMessage] = useState(''); // Состояние для хранения текста сообщения

    // Функция для обработки отправки сообщения
    const handleSendMessage = () => {
        if (message.trim() === '') {
            Alert.alert('Ошибка', 'Пожалуйста, введите текст сообщения');
            return;
        }

        console.log('Сообщение отправлено:', message); // Выводим сообщение в консоль
        Alert.alert('Успех', 'Ваше сообщение отправлено в службу поддержки!');
        setMessage(''); // Очищаем поле ввода
    };

    return (
        <View style={styles.container}>
            {/* Верхняя панель с кнопкой "Назад" */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Octicons name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Служба поддержки</Text>
            </View>

            {/* Поле для ввода текста */}
            <TextInput
                style={styles.input}
                placeholder="Введите ваше сообщение..."
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={(text) => setMessage(text)}
            />

            {/* Кнопка отправки */}
            <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
                <Text style={styles.buttonText}>Отправить</Text>
                <Octicons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFE4C4',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16,
        color: '#000',
        textAlignVertical: 'top', // Для многострочного ввода
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
    },
});

export default SupportScreen;