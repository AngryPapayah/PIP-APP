import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI } from '../services/Fetch';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const XP_PER_LEVEL = 100;
const MAX_LEVEL = 10;

export default function XPBar({ onLevelUp }) {
    const { user } = useAuth();
    const [xp, setXP] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [totalXP, setTotalXP] = useState(0);
    const [showArrow, setShowArrow] = useState(false);

    const progressAnim = useRef(new Animated.Value(0)).current;
    const prevLevelRef = useRef(1);

    const getXPFromUser = (userObj) => {
        return Number(userObj?.xp ?? userObj?.experience ?? userObj?.experience_points ?? 0);
    };

    useEffect(() => {
        if (user) {
            const userTotalXP = getXPFromUser(user);
            const level = Math.floor(userTotalXP / XP_PER_LEVEL) + 1;
            const xpInLevel = userTotalXP % XP_PER_LEVEL;

            setXP(xpInLevel);
            setTotalXP(userTotalXP);
            setCurrentLevel(level);
            setLoading(false);

            if (level > prevLevelRef.current) {
                setShowArrow(true);
                if (onLevelUp) onLevelUp(level, prevLevelRef.current);
                setTimeout(() => setShowArrow(false), 3000);
            }
            prevLevelRef.current = level;
        }
    }, [user, onLevelUp]);

    const fetchUserProgress = useCallback(async () => {
        if (!user?.id) return;

        try {
            const response = await fetchAPI(`users/${user.id}`, 'GET');
            const actualXP = response?.xp ?? response?.experience ?? response?.experience_points;

            if (actualXP !== undefined) {
                const serverTotalXP = Number(actualXP) || 0;
                if (serverTotalXP !== totalXP) {
                    const level = Math.floor(serverTotalXP / XP_PER_LEVEL) + 1;
                    const xpInLevel = serverTotalXP % XP_PER_LEVEL;
                    setXP(xpInLevel);
                    setTotalXP(serverTotalXP);
                    setCurrentLevel(level);
                }
            }
        } catch (error) {
            console.error('[XPBar] Error:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id, totalXP]);

    useFocusEffect(
        useCallback(() => {
            fetchUserProgress();
        }, [fetchUserProgress])
    );

    useEffect(() => {
        const progressValue = Math.min(xp / XP_PER_LEVEL, 1);
        Animated.timing(progressAnim, {
            toValue: progressValue,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [xp]);

    const barWidth = screenWidth - 80;
    const animatedWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, barWidth],
    });

    const getBarColor = () => {
        const percentage = (xp / XP_PER_LEVEL) * 100;
        if (percentage < 25) return '#EF476F';
        if (percentage < 50) return '#FFCC00';
        if (percentage < 75) return '#06D6A0';
        return colors.xpBarIndicator || '#A6AA2C';
    };

    if (loading && !totalXP) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Updaten...</Text>
            </View>
        );
    }

    const progressPercentage = Math.min(Math.round((xp / XP_PER_LEVEL) * 100), 100);

    return (
        <>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowModal(true)}>
                <View style={styles.container}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>
                            LEVEL {currentLevel} {showArrow && '▲'}
                        </Text>
                    </View>
                    <View style={styles.barWrapper}>
                        <View style={[styles.track, { width: barWidth }]}>
                            <Animated.View
                                style={[
                                    styles.filledTrack,
                                    { width: animatedWidth, backgroundColor: getBarColor() }
                                ]}
                            />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.xpText}>{xp} / {XP_PER_LEVEL} XP</Text>
                        <Text style={styles.progressText}>{progressPercentage}%</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.primary || '#FFDFAD' }]}>
                        <Text style={styles.modalTitle}>Statistieken</Text>
                        <View style={styles.statsContainer}>
                            <StatRow label="Totaal verdiende XP" value={`${totalXP} XP`} />
                            <StatRow label="Huidig Level" value={`${currentLevel} / ${MAX_LEVEL}`} />
                            <StatRow label="Volgende level in" value={`${XP_PER_LEVEL - xp} XP`} />
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                            <Text style={styles.closeButtonText}>Lekker bezig!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const StatRow = ({ label, value }) => (
    <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}:</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingVertical: 10 },
    loadingText: { textAlign: 'center', fontSize: 14, color: '#666' },
    levelBadge: { alignItems: 'center', marginBottom: 8 },
    levelBadgeText: {
        backgroundColor: colors.xpBarIndicator || '#A6AA2C',
        color: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: 'bold',
        fontSize: 14
    },
    barWrapper: { alignItems: 'center', marginVertical: 8 },
    track: { height: 20, backgroundColor: colors.xpBarBackground || '#D5B49E', borderRadius: 10, overflow: 'hidden' },
    filledTrack: { height: 20, borderRadius: 10 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    xpText: { fontSize: 14, fontWeight: '600' },
    progressText: { fontSize: 14, fontWeight: '600', color: colors.xpBarIndicator || '#A6AA2C' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { padding: 25, borderRadius: 20, width: '85%' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    statsContainer: { marginBottom: 20 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    statLabel: { fontSize: 14, color: '#444' },
    statValue: { fontSize: 16, fontWeight: 'bold' },
    closeButton: { backgroundColor: colors.xpBarIndicator || '#A6AA2C', padding: 15, borderRadius: 12, alignItems: 'center' },
    closeButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});