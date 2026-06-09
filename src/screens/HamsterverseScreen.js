import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Animated, TouchableOpacity, Text } from 'react-native';
import XPBar from '../components/XPBar';
import { colors } from '../styles/GlobalStyles';

export default function HamsterverseScreen() {
    const [xp, setXP] = useState(0);
    const [level, setLevel] = useState(1);
    const [bounceAnim] = useState(new Animated.Value(0));

    const handleXPChange = (data) => {
        setXP(data.xp);
        setLevel(data.level);
    };

    const increaseXP = () => {
        const newXP = xp + 50;
        setXP(newXP);
        const newLevel = Math.floor(newXP / 100) + 1;
        setLevel(newLevel);
    }

    // Bouncing pip
    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(bounceAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(bounceAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
            ]).start(() => animate());
        };
        animate();
    }, [bounceAnim]);

    // calculate items per xp
    const hasFood = xp >= 100;
    const hasWheel = xp >= 200;
    const hasBridge = xp >= 300;

    const bounce = bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

    return (
        <View style={styles.container}>
            {/* XPBar component */}
            <View style={styles.xpBarSection}>
                <XPBar
                    currentXP={xp}
                    level={level}
                    onXPChange={handleXPChange}
                />
            </View>

            <TouchableOpacity style={styles.xpButton} onPress={increaseXP}>
                <Text style={styles.xpButtonText}>+50 XP</Text>
            </TouchableOpacity>

            {/* Habitat two tone (beige top, orange bottom) */}
            <View style={styles.habitat}>
                <View style={styles.habitatTop} />
                <View style={styles.habitatBottom} />

                {/*moet aangepast worden*/}
                {hasFood && (
                    <Image
                        source={require('../../public/images/food.png')}
                        style={styles.foodPosition}
                        resizeMode="contain"
                        accessibilityLabel="Food bowl"
                    />
                )}

                {hasWheel && (
                    <Image
                        source={require('../../public/images/wheel.png')}
                        style={styles.wheelPosition}
                        resizeMode="contain"
                        accessibilityLabel="Play wheel"
                    />
                )}

                {hasBridge && (
                    <Image
                        source={require('../../public/images/bridge.png')}
                        style={styles.bridgePosition}
                        resizeMode="contain"
                        accessibilityLabel="Play bridge"
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

    xpButton: {
        backgroundColor: '#FF8C42',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignSelf: 'center',
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    xpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
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
        backgroundColor: colors?.primaryButton || '#F09D67', //was in wireframe the same
    },
    item: {
        position: 'absolute',
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
    bridgePosition: {
        position: 'absolute',
        left: '5%',
        bottom: '10%',
        width: 200,
        height: 150,
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