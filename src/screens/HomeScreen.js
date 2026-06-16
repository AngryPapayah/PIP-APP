import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/GlobalStyles';
import ModulesList from "./courses/modules/ModulesList";
import { useLanguage } from '../contexts/LanguageContext';

export default function HomeScreen() {
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
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
    }
});