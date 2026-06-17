import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import XPBar from '../components/XPBar';
import { colors } from '../styles/GlobalStyles';
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchAPI } from "../services/Fetch";

const CopilotView = walkthroughable(({ style, children, ...props }) => (
    <View style={style} {...props}>{children}</View>
));

export default function HamsterverseScreen() {
    const [xpState, setXpState] = useState(0);
    const [levelState, setLevelState] = useState(1);
    const [bounceAnim] = useState(new Animated.Value(0));

    const { user, updateUser } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    const { start, copilotEvents } = useCopilot();
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        const starting = route?.params?.startTour;

        if (isLayoutReady && starting && user?.on_boarding === 0) {
            const timer = setTimeout(() => {
                start("Hamsterverse");
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [isLayoutReady, route?.params, user?.on_boarding]);

    useEffect(() => {
        copilotEvents.on('stop', async () => {
            if (user?.id) {
                try {
                    const result = await fetchAPI(`users/${user.id}/complete-onboarding`, "POST", { on_boarding: 1 });
                    if (result && result.error) {
                        console.error("Server update failed:", result.error);
                    } else {
                        console.log(`Onboarding succesfull to 1 in database for user ${user.id}`);
                    }

                    if (updateUser) {
                        await updateUser({ on_boarding: 1, startTour: false });
                    }

                } catch (error) {
                    console.error("Something went wrong", error);
                }
            }
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: { startTour: false } }],
            });
        });

        return () => {
            copilotEvents.off('start');
            copilotEvents.off('stop');
        };
    }, [updateUser, user?.id, navigation, copilotEvents]);

    const handleXPChange = (data) => {
        setXpState(data.xp);
        setLevelState(data.level);
    };

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(bounceAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(bounceAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
            ]).start(() => animate());
        };
        animate();
    }, [bounceAnim]);

    const xp = user?.xp ?? user?.XP ?? user?.experience_points ?? user?.experience ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;

    const hasFood = xp >= 100;
    const hasWheel = xp >= 200;

    const bounce = bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

    return (
        <View style={styles.container} onLayout={() => setIsLayoutReady(true)}>
            <View style={styles.xpBarSection}>
                <XPBar currentXP={currentXP} level={level} onXPChange={handleXPChange} />
            </View>

            <CopilotStep name="Hamsterverse" order={5}
                         text="Welcome to the Hamsterverse. This is Pip’s habitat, where you can view and collect rewards earned by successfully completing lessons.">
                <CopilotView />
            </CopilotStep>

            <CopilotStep name="EndText" order={6}
                         text="This concludes your introduction to P.I.P. You're now ready to begin your first lesson.">
                <CopilotView />
            </CopilotStep>

            <View style={styles.habitat}>
                <View style={styles.habitatTop} />
                <View style={styles.habitatBottom} />

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
    container: { flex: 1 },
    xpBarSection: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors?.primary || '#FFDFAD' },
    habitat: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: colors?.primary || '#FFDFAD' },
    habitatTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%' },
    habitatBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', backgroundColor: colors?.primaryButton || '#F09D67' },
    foodPosition: { position: 'absolute', left: '75%', top: '65%', width: 70, height: 70 },
    wheelPosition: { position: 'absolute', left: '55%', bottom: '50%', width: 160, height: 160 },
    pipContainer: { position: 'absolute', bottom: '20%', left: '50%', marginLeft: -45, alignItems: 'center' },
    pipImage: { width: 120, height: 120 },
});