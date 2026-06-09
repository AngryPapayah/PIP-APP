import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { colors } from '../styles/GlobalStyles';

const { width: screenWidth } = Dimensions.get('window');

export default function XPBar({ currentXP = 0, level = 2, onXPChange = null }) {
    const [xp, setXP] = useState(currentXP);
    const [currentLevel, setCurrentLevel] = useState(level);
    const [showPopup, setShowPopup] = useState(false);
    const [popupXP, setPopupXP] = useState(0);
    const progressAnim = useRef(new Animated.Value(xp / 100)).current;
    const colorAnim = useRef(new Animated.Value(xp)).current;

    // Animation update when you get XP
    useEffect(() => {
        const progressValue = xp / 100;

        Animated.parallel([
            Animated.timing(progressAnim, {
                toValue: progressValue,
                duration: 600,
                useNativeDriver: false,
            }),
            Animated.timing(colorAnim, {
                toValue: xp,
                duration: 600,
                useNativeDriver: false,
            })
        ]).start();
    }, [xp]);

    const barWidth = screenWidth - 80;
    const animatedWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, barWidth],
    });

    // Color animation from dark green to light green
    const animatedColor = colorAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['#676848', '#A6AA2C'],
    });

    //if needed for testing
    // const addXP = (amount) => {
    //     let newXP = xp + amount;
    //     let newLevel = currentLevel;
    //     let leveledUp = false;
    //
    //     if (newXP >= 100) {
    //         const levelUps = Math.floor(newXP / 100);
    //         newLevel = currentLevel + levelUps;
    //         newXP = newXP % 100;
    //         leveledUp = true;
    //     }
    //
    //     setXP(newXP);
    //     setCurrentLevel(newLevel);
    //     setPopupXP(amount);
    //     setShowPopup(true);
    //     setTimeout(() => {
    //         setShowPopup(false);
    //     }, 2500);
    //
    //     if (onXPChange) {
    //         onXPChange({ xp: newXP, level: newLevel, gained: amount, leveledUp });
    //     }
    // };

    //layout
    return (
        <View style={styles.container}>
            {showPopup && (
                <View style={styles.popupWrapper}>
                    <View style={styles.popupContent}>
                        <Text style={styles.popupText}>+{popupXP} XP</Text>
                    </View>
                </View>
            )}

            <View style={styles.barWrapper}>
                <View style={[styles.track, { width: barWidth }]}>
                    <Animated.View
                        style={[
                            styles.filledTrack,
                            {
                                width: animatedWidth,
                                backgroundColor: animatedColor
                            }
                        ]}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.xpText}>{xp}/100 XP</Text>
                <View style={styles.levelContainer}>
                    <Text style={styles.levelLabel}>LVL</Text>
                    <Text style={styles.levelValue}>{currentLevel}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    popupWrapper: {
        alignItems: 'center',
        position: 'absolute',
        top: -5,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    popupContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 5,
    },
    popupText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'inter',
    },
    barWrapper: {
        alignItems: 'center',
        marginVertical: 8,
        paddingTop: 20,
    },
    track: {
        height: 15,
        backgroundColor: colors.xpBarBackground || '#D5B49E',
        borderRadius: 10,
        overflow: 'hidden',
    },
    filledTrack: {
        height: 15,
        borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    xpText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'inter',
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    levelLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        fontFamily: 'inter',
    },
    levelValue: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'inter',
    },
});