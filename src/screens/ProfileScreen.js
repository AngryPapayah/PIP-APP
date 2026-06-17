import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { colors } from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import XPBar from '../components/XPBar';
import { fetchAPI } from "../services/Fetch";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import SettingsScreen from './SettingsScreen';

const hiddenFields = ['id', 'on_boarding', 'current_level_id', 'experience', 'startTour', 'xp', 'XP', 'experience_points'];

const CopilotView = walkthroughable(({ style, children, ...props }) => (
    <View style={style} {...props}>{children}</View>
));

function isToday(dateString) {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return d.getFullYear() === today.getFullYear()
        && d.getMonth() === today.getMonth()
        && d.getDate() === today.getDate();
}

export default function ProfileScreen() {
    const { logout, user, refreshUser } = useAuth();
    const { t } = useLanguage();
    const [streak, setStreak] = useState(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const hasStartedTour = useRef(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { start, copilotEvents } = useCopilot();

    useEffect(() => {
        if (user?.id) {
            getStreak();
        }
    }, [user]);

    async function getStreak() {
        try {
            const data = await fetchAPI(`users/${user.id}/streak`, 'GET');
            if (data && !data.error && data.status !== 404) {
                const streakData = data.data || data;
                const result = Array.isArray(streakData) ? (streakData[0] || {}) : (streakData || {});
                const justStartedToday = result.current_streak === 0 && isToday(result.last_active_date);
                setStreak({
                    ...result,
                    current_streak: justStartedToday ? 1 : (result.current_streak || 0),
                    highest_streak: result.highest_streak || 0,
                });
            } else {
                setStreak({ current_streak: 0, highest_streak: 0 });
            }
        } catch (error) {
            setStreak({ current_streak: 0, highest_streak: 0 });
        }
    }

    const xp = user?.xp ?? user?.XP ?? user?.experience_points ?? user?.experience ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;

    useFocusEffect(
        useCallback(() => {
            if (user?.on_boarding === 1) {
                refreshUser();
            }
        }, [refreshUser, user?.on_boarding])
    );

    useEffect(() => {
        const starting = route?.params?.startTour;
        if (isLayoutReady && starting && user?.on_boarding === 0 && !hasStartedTour.current) {
            hasStartedTour.current = true;
            const timer = setTimeout(() => {
                start("ProfileText");
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isLayoutReady, route?.params, user?.on_boarding, start]);

    useEffect(() => {
        copilotEvents.on('stop', () => {
            navigation.navigate('Hamsterverse', { startTour: true });
        });
        return () => {
            copilotEvents.off('start');
            copilotEvents.off('stop');
        };
    }, [navigation, copilotEvents]);

    const formatLabel = (key) => {
        const label = key.replace(/_/g, ' ');
        return label.charAt(0).toUpperCase() + label.slice(1);
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            onLayout={() => setIsLayoutReady(true)}
        >
            <CopilotStep name="ProfileText" order={3} text="Dit is je profielpagina. Hier vind je je persoonlijke gegevens.">
                <CopilotView>
                    <Text style={styles.title}>{t.ui.profile}</Text>
                </CopilotView>
            </CopilotStep>

            <CopilotStep name="ProfileXP" order={4} text="Hier zie je je huidige niveau en de verdiende XP.">
                <CopilotView style={styles.xpCard}>
                    <XPBar currentXP={currentXP} level={level} />
                </CopilotView>
            </CopilotStep>

            {streak && (
                <View style={[styles.card, styles.streakContainer]}>
                    <Text style={styles.streakIcon}>🔥</Text>
                    <View>
                        <Text style={styles.streakText}>
                            Streak: {streak?.current_streak || 0} {(streak?.current_streak === 1) ? 'day' : 'days'}
                        </Text>
                        <Text style={styles.highestStreakText}>
                            Highest: {streak?.highest_streak || 0}
                        </Text>
                    </View>
                </View>
            )}

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
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: colors.textMain || '#000' },
    xpCard: { width: '100%', marginBottom: 20 },
    card: { width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 25, borderWidth: 2, borderColor: colors?.accent || '#784F4E' },
    streakContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors?.secondary || '#FFFFFF' },
    streakIcon: { marginRight: 10, fontSize: 24 },
    streakText: { color: colors?.textMain || '#141414', fontSize: 18, fontWeight: 'bold' },
    highestStreakText: { color: colors?.textMain || '#141414', fontSize: 12 },
    row: { marginVertical: 10 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#888', textTransform: 'uppercase' },
    value: { fontSize: 18, color: colors?.textMain || '#333', marginTop: 2, fontWeight: '500' },
    settingsButton: { backgroundColor: colors?.secondary || '#E9C46A', paddingVertical: 14, borderRadius: 25, marginBottom: 15, width: '100%', alignItems: 'center' },
    settingsButtonText: { color: colors?.textMain || '#141414', fontSize: 16, fontWeight: 'bold' },
    logoutButton: { backgroundColor: colors?.error || '#FF3B3B', paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' },
    logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', maxHeight: '80%', backgroundColor: '#FFFFFF', paddingVertical: 25, borderRadius: 20, borderWidth: 2, borderColor: colors?.accent || '#784F4E', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
});