import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

export default function XPBar({ onLevelUp }) {
    const { user } = useAuth();
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [showModal, setShowModal] = useState(false);
    const [showArrow, setShowArrow] = useState(false);

    const totalXP = user?.experience ?? user?.xp ?? user?.XP ?? user?.experience_points ?? 0;    const XP_PER_LEVEL = 100;
    const MAX_LEVEL = 10;
    const currentLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;
    const xpInLevel = totalXP % XP_PER_LEVEL;
    const progressPercentage = Math.min(Math.round((xpInLevel / XP_PER_LEVEL) * 100), 100);

    const prevLevelRef = useRef(currentLevel);

    useEffect(() => {
        const progressValue = Math.min(xpInLevel / XP_PER_LEVEL, 1);
        Animated.timing(progressAnim, {
            toValue: progressValue,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [xpInLevel]);

    useEffect(() => {
        if (currentLevel > prevLevelRef.current) {
            setShowArrow(true);
            setTimeout(() => setShowArrow(false), 3000);
            if (onLevelUp) onLevelUp(currentLevel);
        }
        prevLevelRef.current = currentLevel;
    }, [currentLevel]);

    const barWidth = screenWidth - 80;
    const animatedWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, barWidth],
    });

    const getBarColor = () => {
        if (progressPercentage < 25) return '#EF476F';
        if (progressPercentage < 50) return '#FFCC00';
        if (progressPercentage < 75) return '#06D6A0';
        return '#A6AA2C';
    };

    if (!user) return null;

    return (
        <>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowModal(true)}>
                <View style={styles.container}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>
                            LEVEL {currentLevel} {showArrow && '🡹'}
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
                        <Text style={styles.xpText}>{xpInLevel}/{XP_PER_LEVEL} XP</Text>
                        <Text style={styles.progressText}>{progressPercentage}%</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.primary || '#FFDFAD' }]}>
                        <Text style={styles.modalTitle}>Progressie</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Totaal XP:</Text>
                                <Text style={styles.statValue}>{totalXP} XP</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Huidig Niveau:</Text>
                                <Text style={styles.statValue}>{currentLevel} / {MAX_LEVEL}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Niveau Voortgang:</Text>
                                <Text style={styles.statValue}>{xpInLevel} / {XP_PER_LEVEL} XP</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Volgende niveau in:</Text>
                                <Text style={styles.statValue}>{XP_PER_LEVEL - xpInLevel} XP</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                            <Text style={styles.closeButtonText}>Sluiten</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingVertical: 10 },
    levelBadge: { alignItems: 'center', marginBottom: 8 },
    levelBadgeText: {
        backgroundColor: colors.xpBarIndicator || '#A6AA2C',
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    barWrapper: { alignItems: 'center', marginVertical: 8 },
    track: { height: 20, backgroundColor: colors.xpBarBackground || '#D5B49E', borderRadius: 10, overflow: 'hidden' },
    filledTrack: { height: 20, borderRadius: 10 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    xpText: { fontSize: 14, fontWeight: '600', color: '#000' },
    progressText: { fontSize: 14, fontWeight: '600', color: colors.xpBarIndicator || '#A6AA2C' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { borderRadius: 20, padding: 24, width: screenWidth - 40 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: colors.textMain || '#000000' },
    statsContainer: { marginBottom: 20 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
    statLabel: { fontSize: 14, color: colors.textMain || '#000000' },
    statValue: { fontSize: 16, fontWeight: 'bold', color: colors.textMain || '#000000' },
    closeButton: { backgroundColor: colors.xpBarIndicator || '#A6AA2C', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    closeButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});