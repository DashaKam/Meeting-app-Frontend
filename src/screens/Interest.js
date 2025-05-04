import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {registerUser, saveUserInterests, fetchInterests, fetchUserProfile} from "../services/api";

const InterestScreen = ({ navigation }) => {
    const [interests, setInterests] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [isMaxReached, setIsMaxReached] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            try {
                // Загружаем структуру всех интересов
                const interestsResponse = await fetchInterests(); // GET /user-interests/
                setInterests(interestsResponse.interests);

                // Загружаем профиль пользователя
                const profileResponse = await fetchUserProfile(); // GET /users/me
                const userInterests = profileResponse.interests || [];

                // Преобразуем интересы пользователя в формат { category, interest }
                const selected = [];
                Object.entries(interestsResponse.interests).forEach(([category, items]) => {
                    items.forEach(interest => {
                        if (userInterests.includes(interest)) {
                            selected.push({ category, interest });
                        }
                    });
                });

                setSelectedInterests(selected);
                setIsMaxReached(selected.length >= 10);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                Alert.alert('Ошибка', 'Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleInterestPress = (category, interest) => {
        const existingIndex = selectedInterests.findIndex(
            (item) => item.category === category && item.interest === interest
        );

        let updatedSelected;

        if (existingIndex !== -1) {
            // Удаляем интерес
            updatedSelected = [...selectedInterests];
            updatedSelected.splice(existingIndex, 1);
        } else {
            // Добавляем интерес, если ещё не достигнут лимит
            if (selectedInterests.length >= 10) return; // Не даём добавить больше 10
            updatedSelected = [...selectedInterests, { category, interest }];
        }

        setSelectedInterests(updatedSelected);
        setIsMaxReached(updatedSelected.length >= 10); // Всегда проверяем новое состояние
    };

    const saveInterests = async () => {
        try {
            setSaving(true);

            // Преобразуем выбранные интересы в массив строк
            const interestsArray = selectedInterests.map(item => item.interest);

            // Отправляем PUT-запрос с обновлением интересов
            await saveUserInterests(interestsArray);


            // Возвращаемся назад после успешного сохранения
            navigation.goBack();
        } catch (error) {
            console.error('Ошибка сохранения интересов:', error);
            Alert.alert('Ошибка', 'Не удалось сохранить интересы');
        } finally {
            setSaving(false);
        }
    };

    const renderInterestButton = (category, interest) => {
        const isSelected = selectedInterests.some(
            (item) => item.category === category && item.interest === interest
        );
        const isDisabled = (!isSelected && isMaxReached) || loading;
        return (
            <TouchableOpacity
                key={`${category}-${interest}`}
                style={[
                    styles.button,
                    isSelected ? styles.selectedButton : styles.defaultButton,
                    isDisabled && styles.disabledButton,
                ]}
                onPress={() => handleInterestPress(category, interest)}
                disabled={isDisabled}
            >
                <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>
                    {interest}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Кнопка сохранения и возврата */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={saveInterests}
                    disabled={saving}
                >
                    <Text style={styles.backButtonText}>
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Прокручиваемый контент */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        {Object.entries(interests).map(([category, interestsList]) => (
                            <View key={category} style={styles.categoryContainer}>
                                <Text style={styles.categoryTitle}>{category}</Text>
                                <View style={styles.buttonRow}>
                                    {interestsList.map((interest) => renderInterestButton(category, interest))}
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9EBDE',
    },
    header: {
        padding: 10,
        backgroundColor: '#F9EBDE',
        borderBottomWidth: 1,
        borderBottomColor: '#F9EBDE',
        elevation: 2,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#4a3c32',
        borderRadius: 8,
        width: 120,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontFamily: 'Evolventa',
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#815854',
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        paddingHorizontal: 15,
        paddingVertical: 8,
        margin: 5,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    defaultButton: {},
    selectedButton: {
        backgroundColor: '#4a3c32',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        fontFamily: 'Evolventa',
        fontSize: 14,
        color: '#815854',
    },
    selectedButtonText: {
        fontFamily: 'Evolventa',
        color: '#ffffff',
    },
});

export default InterestScreen;