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
import { registerUser, saveUserInterests, fetchInterests } from "../services/api";

const InterestScreen = ({ navigation }) => {
    const [interests, setInterests] = useState({});
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [isMaxReached, setIsMaxReached] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        const loadInterests = async () => {
            try {
                const data = await fetchInterests();
                let items;
                // Determine shape of returned data
                if (data && Array.isArray(data.interests)) {
                    // { interests: [...] }
                    items = data.interests;
                } else if (Array.isArray(data)) {
                    // [...] directly
                    items = data;
                } else if (data && data.interests && typeof data.interests === 'object') {
                    // { interests: { category: [...] } }
                    items = data.interests;
                } else if (data && typeof data === 'object') {
                    // { category: [...] }
                    items = data;
                } else {
                    console.warn('Unexpected interests response shape:', data);
                    items = {};
                }
                // If items is an array, wrap into a default category
                if (Array.isArray(items)) {
                    items = { All: items };
                }
                setInterests(items);
            } catch (error) {
                console.error('Ошибка загрузки интересов:', error);
                Alert.alert('Ошибка', 'Не удалось загрузить список интересов');
            } finally {
                setLoading(false);
            }
        };
        loadInterests();
    }, []);


    const handleInterestPress = (category, interest) => {
        if (isMaxReached) return;

        const existingIndex = selectedInterests.findIndex(
            (item) => item.category === category && item.interest === interest
        );

        if (existingIndex !== -1) {
            // Удалить выбранный интерес
            const updatedSelected = [...selectedInterests];
            updatedSelected.splice(existingIndex, 1);
            setSelectedInterests(updatedSelected);
            setIsMaxReached(updatedSelected.length >= 10);
        } else {
            // Добавить новый интерес
            setSelectedInterests([...selectedInterests, { category, interest }]);
            setIsMaxReached(selectedInterests.length + 1 >= 10);
        }
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
        const isDisabled = isMaxReached || loading;

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
                        {Object.entries(interests || {}).map(([category, interestsList]) => (
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
        backgroundColor: '#f5e6d3',
    },
    header: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
        color: '#4a3c32',
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
        fontSize: 14,
        color: '#4a3c32',
    },
    selectedButtonText: {
        color: '#ffffff',
    },
});

export default InterestScreen;