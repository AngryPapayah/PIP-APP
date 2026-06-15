import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import XPBar from '../components/XPBar';
import { colors } from '../styles/GlobalStyles';

export default function HamsterverseScreen() {
    const [xp, setXP] = useState(0);
    const [level, setLevel] = useState(1);
    const [bounceAnim] = useState(new Animated.Value(0));

    // Handle XP changes from XPBar
    const handleXPChange = (data) => {
        setXP(data.xp);
        setLevel(data.level);
    };

    // Bouncing pip animation
    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(bounceAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(bounceAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
            ]).start(() => animate());
        };
        animate();
    }, [bounceAnim]);

    // Calculate items per XP (like original code)
    const hasFood = xp >= 100;   // Food at 100 XP (Level 2)
    const hasWheel = xp >= 200;  // Wheel at 200 XP (Level 3)

    const bounce = bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

    return (
        <View style={styles.container}>
            {/* XPBar component */}
            <View style={styles.xpBarSection}>
                <XPBar onXPChange={handleXPChange} />
            </View>

            {/* Habitat two tone (beige top, orange bottom) */}
            <View style={styles.habitat}>
                <View style={styles.habitatTop} />
                <View style={styles.habitatBottom} />

                {/* Food bowl appears at 100 XP */}
                {hasFood && (
                    <Image
                        source={require('../../public/images/food.png')}
                        style={styles.foodPosition}
                        resizeMode="contain"
                        accessibilityLabel="Food bowl"
                    />
                )}

                {/* Hamsterwheel appears at 200 XP */}
                {hasWheel && (
                    <Image
                        source={require('../../public/images/wheel.png')}
                        style={styles.wheelPosition}
                        resizeMode="contain"
                        accessibilityLabel="Play wheel"
                    />
                )}

                {/* P.I.P. single hamster centered in bottom area */}
                <Animated.View style={[styles.pipContainer, { transform: [{ translateY: bounce }] }]}>
                    <Image
                        source={require('../../public/images/pip-body.png')}
                        style={styles.pipImage}
                        resizeMode="contain"
                        accessibilityLabel="P.I.P. hamster"
                    />
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    xpBarSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors?.primary || '#FFDFAD',
    },
    habitat: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colors?.primary || '#FFDFAD',
    },
    habitatTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '45%',
    },
    habitatBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '55%',
        backgroundColor: colors?.primaryButton || '#F09D67', 
    },
    foodPosition: {
        position: 'absolute',
        left: '75%',
        top: '65%',
        width: 70,
        height: 70,
    },
    wheelPosition: {
        position: 'absolute',
        left: '55%',
        bottom: '50%',
        width: 160,
        height: 160,
    },
    pipContainer: {
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        marginLeft: -45,
        alignItems: 'center',
    },
    pipImage: {
        width: 120,
        height: 120,
    },
});