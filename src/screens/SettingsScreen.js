import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, DevSettings, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import { colors } from '../styles/GlobalStyles';
import { useLanguage } from '../contexts/LanguageContext';
import { PipMessages } from '../constants/PipMessages';

export default function SettingsScreen({ onClose }) {
    const { language, setLanguage, t } = useLanguage();
    const [tempLanguage, setTempLanguage] = useState(language);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'nl', label: 'Nederlands' },
        { code: 'hamster', label: '🐹 Hamster' }
    ];

    const handleApplyLanguage = async () => {
        try {
            // 1. Persist the language choice first
            await setLanguage(tempLanguage);

            // 2. Restart the app
            if (__DEV__) {
                // DevSettings is more reliable for local development/Expo Go
                DevSettings.reload();
            } else {
                // Updates.reloadAsync() is used for production builds
                Updates.reloadAsync();
            }
        } catch (error) {
            console.error("Failed to restart app:", error);
            Alert.alert(
                "Language Saved",
                "Please restart the app manually to apply all changes."
            );
            if (onClose) onClose();
        }
    };

    const previewT = PipMessages[tempLanguage]?.ui;

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.title}>{t.ui.settings}</Text>

            <View style={styles.section}>
                <Text style={styles.label}>{t.ui.language}</Text>
                <View style={styles.buttonGroup}>
                    {languages.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={[
                                styles.langButton,
                                tempLanguage === lang.code && styles.activeButton
                            ]}
                            onPress={() => setTempLanguage(lang.code)}
                        >
                            <Text style={[
                                styles.buttonText,
                                tempLanguage === lang.code && styles.activeButtonText
                            ]}>
                                {lang.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {tempLanguage !== language && (
                <View style={styles.restartSection}>
                    <Text style={styles.warningText}>
                        {previewT?.restartWarning || "App will restart"}
                    </Text>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApplyLanguage}
                    >
                        <Text style={styles.applyButtonText}>
                            {previewT?.applyLanguage || "Apply"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {onClose && (
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>{t.ui.close}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        width: '100%',
        alignItems: 'stretch',
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.textMain || '#000',
        textAlign: 'center'
    },
    section: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        color: colors.navbar || '#444',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
    },
    buttonGroup: {
        width: '100%'
    },
    langButton: {
        backgroundColor: '#F8F8F8',
        padding: 16,
        borderRadius: 15,
        marginVertical: 5,
        borderWidth: 1.5,
        borderColor: '#EEE'
    },
    activeButton: {
        backgroundColor: colors.primaryButton || '#F09D67',
        borderColor: colors.primaryButton || '#F09D67'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center'
    },
    activeButtonText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    restartSection: {
        marginVertical: 15,
        padding: 15,
        backgroundColor: '#FFF5F5',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FEB2B2',
        alignItems: 'center'
    },
    warningText: {
        fontSize: 13,
        color: '#C53030',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '500'
    },
    applyButton: {
        backgroundColor: colors.primaryButton || '#F09D67',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '100%'
    },
    applyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    },
    closeButton: {
        backgroundColor: colors.navbar || '#444',
        padding: 15,
        borderRadius: 15,
        marginTop: 10
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center'
    }
});