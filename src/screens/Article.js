import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const articles = [
    {
        id: 1,
        title: 'Психология первых сообщений',
        html: require('../assets/Психология первых сообщений.html'), // Путь к HTML-файлу
    },
    {
        id: 2,
        title: 'Статья 2: Введение в React Native',
        html: require('../assets/Психология первых сообщений.html'),
    },
    {
        id: 3,
        title: 'Статья 3: Как работать с API',
        html: require('../assets/Психология первых сообщений.html'),
    },
];

const ArticleScreen = ({ route, navigation }) => {
    const { article } = route.params;

    // Получаем индекс текущей статьи
    const currentIndex = articles.findIndex((item) => item.id === article.id);

    // Функции для перехода к предыдущей и следующей статьям
    const goToPrevious = () => {
        if (currentIndex > 0) {
            navigation.push('Article', { article: articles[currentIndex - 1] });
        }
    };

    const goToNext = () => {
        if (currentIndex < articles.length - 1) {
            navigation.push('Article', { article: articles[currentIndex + 1] });
        }
    };

    return (
        <View style={styles.container}>
            {/* Верхняя панель с кнопкой "Назад" */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Octicons name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{article.title}</Text>
            </View>

            {/* Отображение HTML через WebView */}
            <WebView
                source={article.html}
                style={styles.webView}
            />

            {/* Кнопки "Предыдущая" и "Следующая" */}
            <View style={styles.navigationButtons}>
                <TouchableOpacity
                    style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
                    onPress={goToPrevious}
                    disabled={currentIndex === 0}
                >
                    <Text style={styles.navButtonText}>
                        {currentIndex > 0 ? articles[currentIndex - 1].title : 'Нет предыдущей'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navButton, currentIndex === articles.length - 1 && styles.disabledButton]}
                    onPress={goToNext}
                    disabled={currentIndex === articles.length - 1}
                >
                    <Text style={styles.navButtonText}>
                        {currentIndex < articles.length - 1 ? articles[currentIndex + 1].title : 'Нет следующей'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFE4C4',
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
    webView: {
        flex: 1,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
    },
    navButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    navButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default ArticleScreen;