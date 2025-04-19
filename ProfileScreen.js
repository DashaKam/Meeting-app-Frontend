import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from './AuthContext';
import PlaceholderImage from './assets/544.jpg';

const ProfileScreen = ({ navigation }) => {
    const { userData, logout } = useAuth();
    const [activeSlide, setActiveSlide] = useState(0);

    const getDerivedImageSources = () => {
        if (userData?.photo_urls?.length > 0) {
            return userData.photo_urls.map(url => ({ uri: url }));
        } else {
            return [PlaceholderImage];
        }
    };

    const imageSources = getDerivedImageSources();
    const hasMultipleImages = imageSources.length > 1 && imageSources[0] !== PlaceholderImage;

    const handleImagePress = () => {
        if (hasMultipleImages) {
            setActiveSlide((prev) => (prev + 1) % imageSources.length);
        }
    };

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
            <TouchableOpacity
                onPress={handleImagePress}
                activeOpacity={hasMultipleImages ? 0.2 : 1.0}
                style={styles.imageContainer}>
                <Image source={imageSources[activeSlide]} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>{userData?.name || 'Имя'}</Text>
                    <Text style={styles.infoText}>Оценка: {userData?.rating?.toFixed(1) || 'N/A'}</Text>
                    <Text style={styles.infoText}>{userData?.tags?.join(', ') || 'Интересы'}</Text>
                </View>
            </TouchableOpacity>

            {hasMultipleImages && (
                <View style={styles.indicatorContainer}>
                    {imageSources.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                activeSlide === index
                                    ? styles.activeIndicator
                                    : styles.inactiveIndicator,
                            ]}
                        />
                    ))}
                </View>
            )}

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

            <View style={[styles.navBar]}>
                {[
                    {
                        icon: 'auto-awesome-mosaic',
                        label: 'Подборки',
                        library: 'MaterialIcons',
                    },
                    {
                        icon: 'account-group-outline',
                        label: 'Люди',
                        library: 'MaterialCommunityIcons',
                    },
                    {
                        icon: 'calendar-month',
                        label: 'Мои мероприятия',
                        library: 'MaterialCommunityIcons',
                    },
                    {
                        icon: 'auto-awesome-motion',
                        label: 'Мероприятия',
                        library: 'MaterialIcons',
                    },
                    {
                        icon: 'account-heart-outline',
                        label: 'Профиль',
                        library: 'MaterialCommunityIcons',
                    },
                ].map((item, index) => (
                    <TouchableOpacity key={index} style={[styles.navItem]}>
                        {item.label !== 'Профиль' &&
                            (item.library === 'MaterialCommunityIcons' ? (
                                <MaterialCommunityIcons
                                    name={item.icon}
                                    size={30}
                                    color="#828282"
                                />
                            ) : (
                                <MaterialIcons name={item.icon} size={30} color="#828282" />
                            ))}
                        {item.label === 'Профиль' && (
                            <MaterialCommunityIcons
                                name="account-heart-outline"
                                size={30}
                                color="#FFE4C4"
                            />
                        )}
                        <Text style={styles.navItemLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
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

    imageContainer: {
        position: 'relative',
        width: '100%',
        height: Dimensions.get('window').height / 3,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 30,
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },

    infoContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        padding: 10,
        borderRadius: 5,
    },

    infoText: {
        color: '#000',
        fontSize: 20,
        marginBottom: 5,
    },

    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: -40,
    },

    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },

    activeIndicator: {
        backgroundColor: '#000000',
    },
    inactiveIndicator: {
        backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
        marginTop: 50,
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
    navBar: {
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 1, borderTopWidth: 1, borderTopColor: '#E0E0E0', borderRadius: 10, overflow: 'hidden',
    }, navItem: { alignItems: 'center', }, navItemLabel: { fontSize: 10, },
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