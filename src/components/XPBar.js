import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI } from '../services/Fetch';

const { width: screenWidth } = Dimensions.get('window');

export default function XPBar() {
    const { user } = useAuth();
    const [xp, setXP] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const progressAnim = useRef(new Animated.Value(0)).current;

    const XP_PER_LEVEL = 100;
    const MAX_LEVEL = 10;

    useEffect(() => {
        if (user?.id) {
            fetchUserProgress();
        }
    }, [user]);

    const fetchUserProgress = async () => {
        try {
            const data = await fetchAPI(`users/${user.id}/progress`, 'GET');
            if (data) {
                setXP(data.xp || 0);
                setCurrentLevel(Math.min(data.level || 1, MAX_LEVEL));
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (newXP, newLevel) => {
        try {
            await fetchAPI(`users/${user.id}/progress`, 'PUT', {
                xp: newXP,
                level: newLevel
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    useEffect(() => {
        const progressValue = xp / XP_PER_LEVEL;
        Animated.timing(progressAnim, {
            toValue: progressValue,
            duration: 600,
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
        return '#A6AA2C';
    };

    const xpToNextLevel = XP_PER_LEVEL - xp;
    const progressPercentage = Math.round((xp / XP_PER_LEVEL) * 100);

    if (loading || !user) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.7}>
                <View style={styles.container}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>LEVEL {currentLevel}</Text>
                    </View>

                    <View style={styles.barWrapper}>
                        <View style={[styles.track, { width: barWidth }]}>
                            <Animated.View
                                style={[
                                    styles.filledTrack,
                                    {
                                        width: animatedWidth,
                                        backgroundColor: getBarColor()
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.xpText}>{xp}/{XP_PER_LEVEL} XP</Text>
                        <Text style={styles.progressText}>{progressPercentage}%</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.primary || '#FFDFAD' }]}>
                        <Text style={styles.modalTitle}>Your Progress</Text>

                        <View style={styles.levelContainer}>
                            <Text style={styles.levelLabel}>Current Level</Text>
                            <Text style={styles.levelValue}>{currentLevel} / {MAX_LEVEL}</Text>
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Current XP:</Text>
                                <Text style={styles.statValue}>{xp} XP</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Next level in:</Text>
                                <Text style={styles.statValue}>{xpToNextLevel} XP</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Completion:</Text>
                                <Text style={styles.statValue}>{progressPercentage}%</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'inter',
    },
    levelBadge: {
        alignItems: 'center',
        marginBottom: 8,
    },
    levelBadgeText: {
        backgroundColor: colors.xpBarIndicator || '#A6AA2C',
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'inter',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    barWrapper: {
        alignItems: 'center',
        marginVertical: 8,
    },
    track: {
        height: 20,
        backgroundColor: colors.xpBarBackground || '#D5B49E',
        borderRadius: 10,
        overflow: 'hidden',
    },
    filledTrack: {
        height: 20,
        borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    xpText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'inter',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.xpBarIndicator || '#A6AA2C',
        fontFamily: 'inter',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 20,
        padding: 24,
        width: screenWidth - 40,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'inter',
        textAlign: 'center',
        marginBottom: 20,
        color: colors.textMain || '#000000',
    },
    levelContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: colors.xpBarIndicator || '#A6AA2C',
        padding: 12,
        borderRadius: 12,
    },
    levelLabel: {
        fontSize: 14,
        fontFamily: 'inter',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    levelValue: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'inter',
        color: '#FFFFFF',
    },
    statsContainer: {
        marginBottom: 20,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    statLabel: {
        fontSize: 14,
        fontFamily: 'inter',
        color: colors.textMain || '#000000',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'inter',
        color: colors.textMain || '#000000',
    },
    closeButton: {
        backgroundColor: colors.xpBarIndicator || '#A6AA2C',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'inter',
    },
});