import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles/GlobalStyles';
import { useLanguage } from '../contexts/LanguageContext';

export default function SettingsScreen({ onClose }) {
    const { language, setLanguage, t } = useLanguage();

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.title}>{t.ui.settings}</Text>

            <View style={styles.section}>
                <Text style={styles.label}>{t.ui.language}</Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.langButton, language === 'en' && styles.activeButton]}
                        onPress={() => setLanguage('en')}
                    >
                        <Text style={[styles.buttonText, language === 'en' && styles.activeButtonText]}>English</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.langButton, language === 'nl' && styles.activeButton]}
                        onPress={() => setLanguage('nl')}
                    >
                        <Text style={[styles.buttonText, language === 'nl' && styles.activeButtonText]}>Nederlands</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.langButton, language === 'hamster' && styles.activeButton]}
                        onPress={() => setLanguage('hamster')}
                    >
                        <Text style={[styles.buttonText, language === 'hamster' && styles.activeButtonText]}>🐹 Hamster</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {onClose && (
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Sluiten</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    innerContainer: { width: '100%', alignItems: 'stretch' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: colors.textMain, textAlign: 'center' },
    section: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: colors.navbar, textTransform: 'uppercase', letterSpacing: 1 },
    buttonGroup: { width: '100%' },
    langButton: { backgroundColor: '#F0F0F0', padding: 15, borderRadius: 12, marginVertical: 4, borderWidth: 1, borderColor: '#E0E0E0' },
    activeButton: { backgroundColor: colors.primaryButton, borderColor: colors.primaryButton },
    buttonText: { fontSize: 16, fontWeight: '500', color: '#333', textAlign: 'center' },
    activeButtonText: { color: '#FFF', fontWeight: 'bold' },
    closeButton: { backgroundColor: colors.navbar, padding: 15, borderRadius: 12, marginTop: 10 },
    closeButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', textAlign: 'center' }
});