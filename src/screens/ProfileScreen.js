import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { globalStyles, colors } from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import XPBar from '../components/XPBar';
import SettingsScreen from './SettingsScreen';

const hiddenFields = ['id', 'on_boarding', 'current_level_id', 'experience', 'xp', 'XP', 'experience_points'];

export default function ProfileScreen() {
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const formatLabel = (key) => {
        const label = key.replace(/_/g, ' ');
        return label.charAt(0).toUpperCase() + label.slice(1);
    };

    const xp = user?.xp ?? user?.XP ?? user?.experience_points ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={[globalStyles?.text || styles.title, { color: colors.textMain }]}>
                {t.ui.profile}
            </Text>

            <View style={styles.xpCard}>
                <XPBar currentXP={currentXP} level={level} />
            </View>

            {user && (
                <View style={styles.card}>
                    {Object.entries(user)
                        .filter(([key]) => !hiddenFields.includes(key))
                        .map(([key, value], index, array) => (
                            <View key={key} style={[styles.row, index !== array.length - 1 && styles.borderBottom]}>
                                <Text style={styles.label}>{formatLabel(key)}</Text>
                                <Text style={styles.value}>{String(value || '-')}</Text>
                            </View>
                        ))}
                </View>
            )}

            <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettingsModal(true)}>
                <Text style={styles.settingsButtonText}>{t.ui.settings}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>{t.ui.signOut}</Text>
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={showSettingsModal} onRequestClose={() => setShowSettingsModal(false)}>
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
    container: { flexGrow: 1, backgroundColor: colors?.primary || '#F4E1C1', padding: 20, alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    xpCard: { width: '100%', marginBottom: 20 },
    card: { width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 25, borderWidth: 2, borderColor: colors?.accent || '#784F4E' },
    row: { marginVertical: 10 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#888', textTransform: 'uppercase' },
    value: { fontSize: 18, color: colors?.textMain || '#333', marginTop: 2, fontWeight: '500' },
    settingsButton: { backgroundColor: colors?.secondary || '#E9C46A', paddingVertical: 14, borderRadius: 25, marginBottom: 15, width: '100%', alignItems: 'center' },
    settingsButtonText: { color: colors?.textMain || '#141414', fontSize: 16, fontWeight: 'bold' },
    logoutButton: { backgroundColor: colors?.error || '#FF3B3B', paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' },
    logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 10,
        overflow: 'hidden'
    }
});