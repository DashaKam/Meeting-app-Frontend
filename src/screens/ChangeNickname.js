import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChangeNicknameScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Экран изменения никнейма</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChangeNicknameScreen;