import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PlaceholderImage from '../assets/544.jpg';

const UserImageDisplay = ({ imageSources = [PlaceholderImage], userData = {}, containerStyle = {} }) => {
    const [activeSlide, setActiveSlide] = useState(0);

    const hasMultipleImages = imageSources.length > 1 && imageSources[0] !== PlaceholderImage;

    const handleImagePress = () => {
        if (hasMultipleImages) {
            setActiveSlide((prev) => (prev + 1) % imageSources.length);
        }
    };

    const finalImageSources = imageSources.length > 0 ? imageSources : [PlaceholderImage];

    return (
        <View style={[styles.outerContainer, containerStyle]}>
            <TouchableOpacity
                onPress={handleImagePress}
                activeOpacity={hasMultipleImages ? 0.2 : 1.0}
                style={styles.imageContainer}>
                <Image source={finalImageSources[activeSlide]} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>{userData?.name || 'Имя'}</Text>
                    <Text style={styles.infoText}>Оценка: {userData?.rating?.toFixed(1) || 'N/A'}</Text>
                    <Text style={styles.infoText}>{userData?.tags?.join(', ') || 'Интересы'}</Text>
                </View>
            </TouchableOpacity>

            {hasMultipleImages && (
                <View style={styles.indicatorContainer}>
                    {finalImageSources.map((_, index) => (
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
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: Dimensions.get('window').height / 3,
        borderRadius: 10,
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowRadius: 10
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 8,
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
});

export default UserImageDisplay; 