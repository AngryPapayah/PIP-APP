import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Animated, ActivityIndicator } from 'react-native';
import XPBar from '../components/XPBar';
import { colors } from '../styles/GlobalStyles';
import {fetchAPI} from "../services/Fetch";
import {useAuth} from "../contexts/AuthContext";

export default function HamsterverseScreen() {
    const [experience, setExperience] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bounceAnim] = useState(new Animated.Value(0));
    const { user } = useAuth();

    // Fetch hamsterverse data from database
    useEffect(() => {
        if (user?.id) {
            loadHamsterverseData();
        }
    }, [user]);

    const loadHamsterverseData = async () => {
        try {
            setLoading(true);
            const response = await fetchAPI(`/hamsterverse/${user.id}`, {
                method: 'GET',
            });

            if (response.success && response.data) {
                setExperience(response.data.experience || 0);
                setCurrentLevel(response.data.currentLevel || 1);
                setRewards(response.data.rewards || []);
            }
        } catch (error) {
            console.error('Error loading hamsterverse:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleXPChange = (data) => {
        setExperience(data.xp);
        setCurrentLevel(data.level);
        loadHamsterverseData(); // Reload to get updated rewards
    };

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

    // Filter unlock rewards
    const unlockedRewards = rewards.filter(reward => reward.isUnlocked === true);
    const bounce = bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primaryButton} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.xpBarSection}>
                <XPBar
                    currentXP={experience}
                    level={currentLevel}
                    onXPChange={handleXPChange}
                />
            </View>

            <View style={styles.habitat}>
                <View style={styles.habitatTop} />
                <View style={styles.habitatBottom} />

                {unlockedRewards.map((reward) => {
                    const imageSource = { uri: reward.image_url };

                    return (
                        <Image
                            key={reward.id}
                            source={imageSource}
                            style={getRewardStyle(reward.title)}
                            resizeMode="contain"
                            accessibilityLabel={reward.title}
                        />
                    );
                })}

                {/* P.I.P. hamster */}
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

// Helper functie voor de styling per reward title
const getRewardStyle = (title) => {
    switch(title) {
        case 'Feeder':
            return styles.foodPosition;
        case 'Hamsterwheel':
            return styles.wheelPosition;
        case 'Bridge':
            return styles.bridgePosition;
        default:
            return styles.foodPosition;
    }
};

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