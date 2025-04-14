import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView, // Импортируем ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const images = [
    require('./assets/544.jpg'),
    require('./assets/544.jpg'),
    require('./assets/544.jpg'),
];

const ProfileScreen = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const handleImagePress = () => {
        setActiveSlide((prev) => (prev + 1) % images.length);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Окно для фотографии */}
            <TouchableOpacity
                onPress={handleImagePress}
                style={styles.imageContainer}>
                <Image source={images[activeSlide]} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Иван</Text>
                    <Text style={styles.infoText}>Оценка: 5</Text>
                    <Text style={styles.infoText}>Спорт, Музыка</Text>
                </View>
            </TouchableOpacity>

            {/* Индикаторы текущего слайда */}
            <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
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

            {/* Прокручиваемая область для кнопок */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Кнопки действий */}
                {[
                    'Редактировать анкету',
                    'Избранные мероприятия',
                    'Мероприятия',
                    'Может быть интересно',
                    'Темная тема???',
                    'Связаться с поддержкой',
                    'Выйти из профиля',
                ].map((buttonLabel) => (
                    <TouchableOpacity key={buttonLabel} style={styles.button}>
                        <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Панель навигации */}
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
        justifyContent: "space-between", // Обеспечивает равномерное распределение пространства между элементами
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

    indicator:{
        width :8 ,
        height :8 ,
        borderRadius :4 ,
        marginHorizontal :5 ,
    },

    activeIndicator:{
        backgroundColor:'#000000',},
    inactiveIndicator:{
        backgroundColor:'#FFFFFF',},
    buttonContainer:{
        marginTop :50,},
    button:{
        paddingVertical :10 ,
        paddingHorizontal :10 ,
        borderRadius :5 ,
        marginVertical :1 ,},
    buttonText:{
        color:'#000',
//1080 x2400 пикселей
        fontSize :0.025 *(Dimensions.get('window').height),},
    navBar:{
        flexDirection:'row',justifyContent:'space-around',alignItems:'center',backgroundColor:'#FFFFFF',paddingVertical :1 ,borderTopWidth :1 ,borderTopColor:'#E0E0E0',borderRadius :10 ,overflow:'hidden',},navItem:{alignItems:'center',},navItemLabel:{fontSize :10,},
    scrollContainer:{
        flexGrow :1 , // Позволяет ScrollView занимать все доступное пространство
        justifyContent :'flex-start' // Начинаем с верхней части ScrollView
    },});

export default ProfileScreen;