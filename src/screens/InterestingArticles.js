import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';

const articles = [
    {
        id: 1,
        title: 'Психология первых сообщений',
        html: require('../assets/Психология первых сообщений.html'), // Путь к HTML-файлу
    },
    // {
    //     id: 2,
    //     title: 'Статья 2: Введение в React Native',
    //     html: require('../assets/article2.html'),
    // },
    // {
    //     id: 3,
    //     title: 'Статья 3: Как работать с API',
    //     html: require('../assets/article3.html'),
    // },
];

const InterestingArticles = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Верхняя панель с кнопкой "Назад" */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Octicons name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Может быть интересно</Text>
            </View>

            {/* Список статей */}
            <ScrollView style={styles.scrollContainer}>
                {articles.map((article) => (
                    <TouchableOpacity
                        key={article.id}
                        style={styles.articleButton}
                        onPress={() => navigation.navigate('Article', { article })}
                    >
                        <Text style={styles.articleTitle}>{article.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
    scrollContainer: {
        flexGrow: 1,
    },
    articleButton: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    articleTitle: {
        fontSize: 18,
        color: '#000',
    },
});

export default InterestingArticles;