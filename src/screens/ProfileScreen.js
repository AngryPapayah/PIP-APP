import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, colors } from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import XPBar from '../components/XPBar';
import SettingsScreen from './SettingsScreen';

const hiddenFields = ['id', 'on_boarding', 'current_level_id', 'experience', 'XP', 'experience_points', 'xp'];

const labelMap = {
    Digital_skill_level: 'Digital skill level',
};

export default function ProfileScreen() {
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const navigation = useNavigation();
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const formatLabel = (key) => {
        if (labelMap[key]) return labelMap[key];
        const label = key.replace(/_/g, ' ');
        return label.charAt(0).toUpperCase() + label.slice(1);
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={[globalStyles?.text || styles.title, { color: colors.textMain }]}>
                {t.ui.profile}
            </Text>

            <View style={styles.xpCard}>
                <XPBar />
            </View>

            {user && (
                <View style={styles.card}>
                    {Object.entries(user)
                        .filter(([key]) => !hiddenFields.includes(key))
                        .map(([key, value], index, array) => (
                            <View
                                key={key}
                                style={[
                                    styles.row,
                                    index === array.length - 1 ? { borderBottomWidth: 0 } : null
                                ]}
                            >
                                <Text style={styles.label}>{formatLabel(key)}</Text>
                                <Text style={styles.value}>{renderValue(value)}</Text>
                            </View>
                        ))}
                </View>
            )}

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setShowSettingsModal(true)}
            >
                <Text style={styles.settingsButtonText}>{t.ui.settings}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>{t.ui.signOut}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showSettingsModal}
                onRequestClose={() => setShowSettingsModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <SettingsScreen onClose={() => setShowSettingsModal(false)} />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: colors?.primary || '#FFDFAD', padding: 20, alignItems: 'center', paddingBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', marginVertical: 20 },
    xpCard: { width: '100%', marginBottom: 20, backgroundColor: '#fff', borderRadius: 15, paddingVertical: 10, elevation: 3 },
    card: { width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 25, borderWidth: 2, borderColor: colors?.accent || '#784F4E' },
    row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    label: { fontSize: 12, fontWeight: 'bold', color: '#888', textTransform: 'uppercase' },
    value: { fontSize: 18, color: colors?.textMain || '#333', marginTop: 4, fontWeight: '600' },
    settingsButton: { backgroundColor: colors?.primaryButton || '#D97706', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 12 },
    settingsButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    logoutButton: { backgroundColor: colors?.error || '#FF3B3B', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, width: '100%', alignItems: 'center' },
    logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    modalContent: { backgroundColor: '#FFFFFF', borderRadius: 25, padding: 25, width: '85%', elevation: 10, borderWidth: 2, borderColor: colors.primary }
});