import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/Auth';
import Icon from 'react-native-vector-icons/Octicons';
import api from '../services/api';
import { fetchInterests, fetchUserProfile } from '../services/api';

const ProfileEditing = () => {
    const navigation = useNavigation();
    const { userData } = useAuth();
    const [aboutMe, setAboutMe] = useState(userData?.about_me || '');
    const [photos, setPhotos] = useState(userData?.photo_urls || []);
    const [userInterests, setUserInterests] = useState([]);
    const [, setAllInterests] = useState({});
    const [loadingInterests, setLoadingInterests] = useState(true);

    // Fetch user interests
    useEffect(() => {
        const loadInterestsData = async () => {
            try {
                // Fetch all available interests
                const interestsResponse = await fetchInterests();
                setAllInterests(interestsResponse.interests);

                // Fetch user profile to get selected interests
                const profileResponse = await fetchUserProfile();
                const interests = profileResponse.interests || [];

                // Transform interests into objects with category
                const userInterestsWithCategory = [];
                Object.entries(interestsResponse.interests).forEach(([category, items]) => {
                    items.forEach(interest => {
                        if (interests.includes(interest)) {
                            userInterestsWithCategory.push({ category, interest });
                        }
                    });
                });

                setUserInterests(userInterestsWithCategory);
            } catch (error) {
                console.error('Error loading interests:', error);
                Alert.alert('Ошибка', 'Не удалось загрузить интересы');
            } finally {
                setLoadingInterests(false);
            }
        };

        loadInterestsData();
    }, []);

    // Maximum number of photos allowed
    const MAX_PHOTOS = 6;

    // Function to handle photo selection (simulated)
    const handlePhotoSelect = (index) => {
        Alert.alert(
            "Выбор фото",
            "В реальном приложении здесь откроется галерея для выбора фото",
            [
                {
                    text: "Отмена",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        // Simulate adding a new photo
                        if (index >= photos.length) {
                            // Add a new photo placeholder
                            const newPhotos = [...photos];
                            newPhotos.push(`https://picsum.photos/200/300?random=${Date.now()}`);
                            setPhotos(newPhotos);
                        } else {
                            // Replace an existing photo
                            const newPhotos = [...photos];
                            newPhotos[index] = `https://picsum.photos/200/300?random=${Date.now()}`;
                            setPhotos(newPhotos);
                        }
                    }
                }
            ]
        );
    };

    // Function to save profile changes
    const saveProfile = async () => {
        try {
            // Update the profile with about_me text
            await api.put('/users/me', {
                about_me: aboutMe,
                photo_urls: photos
            });

            Alert.alert("Успех", "Профиль успешно обновлен");
            navigation.goBack();
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert("Ошибка", "Не удалось сохранить изменения");
        }
    };

    // Function to navigate to the interests screen
    const navigateToInterests = () => {
        navigation.navigate('Interest');
    };

    // Render photo selection boxes
    const renderPhotoBoxes = () => {
        const boxes = [];

        // Render existing photos and empty boxes up to MAX_PHOTOS
        for (let i = 0; i < MAX_PHOTOS; i++) {
            if (i < photos.length) {
                // Render an existing photo
                boxes.push(
                    <TouchableOpacity 
                        key={i} 
                        style={styles.photoBox}
                        onPress={() => handlePhotoSelect(i)}
                    >
                        <Image 
                            source={{ uri: photos[i] }} 
                            style={styles.photoImage} 
                        />
                    </TouchableOpacity>
                );
            } else {
                // Render empty box with plus icon
                boxes.push(
                    <TouchableOpacity 
                        key={i} 
                        style={styles.photoBox}
                        onPress={() => handlePhotoSelect(i)}
                    >
                        <Icon name="plus" size={30} color="#815854" />
                    </TouchableOpacity>
                );
            }
        }

        return boxes;
    };

    // Render user interests
    const renderUserInterests = () => {
        if (loadingInterests) {
            return <ActivityIndicator size="small" color="#815854" style={styles.loadingIndicator} />;
        }

        if (userInterests.length === 0) {
            return (
                <Text style={styles.noInterestsText}>
                    У вас пока нет выбранных интересов
                </Text>
            );
        }

        return (
            <View style={styles.interestsContainer}>
                {userInterests.map((item, index) => (
                    <View key={index} style={styles.interestItem}>
                        <Text style={styles.interestText}>{item.interest}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#815854" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Редактирование профиля</Text>
                <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Фотографии профиля</Text>
            <View style={styles.photoContainer}>
                {renderPhotoBoxes()}
            </View>

            <Text style={styles.sectionTitle}>Обо мне</Text>
            <TextInput
                style={styles.aboutMeInput}
                multiline
                placeholder="Расскажите о себе..."
                value={aboutMe}
                onChangeText={setAboutMe}
            />

            <Text style={styles.sectionTitle}>Мои интересы</Text>
            {renderUserInterests()}

            <TouchableOpacity 
                style={styles.interestsButton}
                onPress={navigateToInterests}
            >
                <Text style={styles.interestsButtonText}>Редактировать интересы</Text>
                <Icon name="chevron-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE4C4',
        padding: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 10
    },
    backButton: {
        padding: 8
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Evolventa',
        fontWeight: 'bold',
        color: '#815854'
    },
    saveButton: {
        backgroundColor: '#815854',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Evolventa',
        fontWeight: 'bold'
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Evolventa',
        fontWeight: 'bold',
        color: '#815854',
        marginBottom: 10,
        marginTop: 20
    },
    photoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#FFFEFE',
        borderRadius: 10,
        padding: 10
    },
    photoBox: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden'
    },
    photoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8
    },
    aboutMeInput: {
        backgroundColor: '#FFFEFE',
        borderRadius: 10,
        padding: 12,
        minHeight: 120,
        textAlignVertical: 'top',
        fontFamily: 'Evolventa',
        fontSize: 14,
        color: '#815854'
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#FFFEFE',
        borderRadius: 10,
        padding: 10
    },
    interestItem: {
        backgroundColor: '#815854',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1
    },
    interestText: {
        color: '#FFFFFF',
        fontFamily: 'Evolventa',
        fontSize: 14
    },
    noInterestsText: {
        fontFamily: 'Evolventa',
        fontSize: 14,
        color: '#815854',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 15,
        backgroundColor: '#FFFEFE',
        borderRadius: 10
    },
    loadingIndicator: {
        padding: 20
    },
    interestsButton: {
        backgroundColor: '#815854',
        borderRadius: 10,
        padding: 15,
        marginTop: 30,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    interestsButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Evolventa',
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default ProfileEditing;
