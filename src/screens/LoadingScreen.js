import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../styles/GlobalStyles';

export const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primaryButton} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
    text: {
        marginTop: 10,
        fontSize: 18,
        color: colors.textMain,
    },
});