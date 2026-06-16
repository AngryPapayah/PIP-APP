import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/GlobalStyles';
import ModulesList from "./courses/modules/ModulesList";
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
    const { t } = useLanguage();
    const { refreshUser, user } = useAuth();

    useFocusEffect(
        React.useCallback(() => {
            refreshUser();
        }, [refreshUser])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.xpText}>XP: {user?.experience || 0}</Text>
            <Text style={styles.text}>{t.ui.yourModules}</Text>
            <ModulesList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#F4E1C1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    },
    xpText: {
        fontSize: 18,
        fontWeight: 'bold',
        position: 'absolute',
        top: 50,
        right: 20
    }
});