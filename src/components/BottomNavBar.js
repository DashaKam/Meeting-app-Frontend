import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const navItemsData = [
    {
        icon: 'auto-awesome-mosaic',
        label: 'Подборки',
        screenName: 'Recommendations',
        library: 'MaterialIcons',
    },
    {
        icon: 'account-group-outline',
        label: 'Люди',
        screenName: 'PeopleSwipe',
        library: 'MaterialCommunityIcons',
    },
    {
        icon: 'calendar-month',
        label: 'Мои мероприятия',
        screenName: 'MyEvents',
        library: 'MaterialCommunityIcons',
    },
    {
        icon: 'auto-awesome-motion',
        label: 'Мероприятия',
        screenName: 'Events',
        library: 'MaterialIcons',
    },
    {
        icon: 'account-heart-outline',
        label: 'Профиль',
        screenName: 'Profile',
        library: 'MaterialCommunityIcons',
    },
];

const BottomNavBar = ({ currentScreen, activeColor }) => {
    const navigation = useNavigation();
    const inactiveColor = '#828282';

    return (
        <View style={styles.navBar}>
            {navItemsData.map((item, index) => {
                const isActive = item.screenName === currentScreen;
                const iconColor = isActive ? activeColor : inactiveColor;
                const IconComponent = item.library === 'MaterialCommunityIcons' ? MaterialCommunityIcons : MaterialIcons;

                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.navItem}
                        onPress={() => navigation.navigate(item.screenName)}
                        disabled={isActive}
                    >
                        <IconComponent name={item.icon} size={30} color={iconColor} />
                        <Text style={[styles.navItemLabel, { color: iconColor }]}>{item.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        borderRadius: 10,
        overflow: 'hidden',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    navItem: {
        alignItems: 'center',
        flex: 1,
    },
    navItemLabel: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    },
});

export default BottomNavBar; 