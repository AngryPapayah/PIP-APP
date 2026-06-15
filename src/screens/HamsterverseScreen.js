import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, Animated} from 'react-native';
import XPBar from '../components/XPBar';
import {colors} from '../styles/GlobalStyles';
import {CopilotStep, useCopilot, walkthroughable} from "react-native-copilot";
import {useAuth} from "../contexts/AuthContext";
import {useNavigation, useRoute} from "@react-navigation/native";
import {fetchAPI} from "../services/Fetch";

//onboarding
const CopilotView = walkthroughable(({style, children, ...props}) => (
    <View style={style} {...props}>{children}</View>
));

export default function HamsterverseScreen() {
    const [xp, setXP] = useState(0);
    const [level, setLevel] = useState(1);
    const [bounceAnim] = useState(new Animated.Value(0));

    //onboarding
    const {user, updateUser} = useAuth();
    const navigation = useNavigation()
    const route = useRoute()

    //onboarding
    const {start, copilotEvents} = useCopilot()
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    //onboarding
    useEffect(() => {
        const starting = route?.params?.startTour

        if (isLayoutReady && starting) {
            // console.log("LOG: hamsterverse layout klaar. Start hamsterverse-tour!");
            const timer = setTimeout(() => {
                start("Hamsterverse");
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [isLayoutReady, route?.params]);

    //onboarding
    useEffect(() => {

        copilotEvents.on('start', () => {
            // console.log("COPILOT EVENT: De onboarding-tour is OFFICIEEL gestart op het scherm!");
        });

        copilotEvents.on('stop', async () => {
            // console.log("Tour op hamsterverse klaar, status veranderen en naar home")

            if (user?.id) {
                try {
                    const result = await fetchAPI(`users/${user.id}`, "PUT", {on_boarding: 1})
                    if (result && result.error) {
                        console.error("Server update failed:", result.error);
                    } else {
                        console.log(`Onboarding succesfull to 1 in database for user ${user.id}`);
                    }

                    if (updateUser) {
                        await updateUser({on_boarding: 1});
                        // console.log("LOG: Local state en AsyncStorage succesfully edited!");
                    }

                } catch (error) {
                    console.error("Something went wrong", error);
                }
            }
            navigation.reset({
                index: 0,
                routes: [{name: 'Home', params: {startTour: false}}],
            });
        })

        return () => {
            copilotEvents.off('start')
            copilotEvents.off('stop')
        }
    }, [updateUser]);

    // Handle XP changes from XPBar
    const handleXPChange = (data) => {
        setXP(data.xp);
        setLevel(data.level);
    };

    // Bouncing pip animation
    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(bounceAnim, {toValue: 1, duration: 700, useNativeDriver: true}),
                Animated.timing(bounceAnim, {toValue: 0, duration: 700, useNativeDriver: true}),
            ]).start(() => animate());
        };
        animate();
    }, [bounceAnim]);

    // Calculate items per XP (like original code)
    const hasFood = xp >= 100;   // Food at 100 XP (Level 2)
    const hasWheel = xp >= 200;  // Wheel at 200 XP (Level 3)

    const bounce = bounceAnim.interpolate({inputRange: [0, 1], outputRange: [0, -8]});

    return (

        <View style={styles.container} onLayout={() => setIsLayoutReady(true)}>
            {/* XPBar component */}
            <View style={styles.xpBarSection}>
                <XPBar onXPChange={handleXPChange}/>
            </View>

            <CopilotStep name="Hamsterverse" order={5}
                         text="Welcome to the Hamsterverse. Pips habitat and the place where you will find your rewards after succesfully completing a lesson.">
                <CopilotView>
                </CopilotView>
            </CopilotStep>

            <CopilotStep name="EndText" order={6}
                         text="This was your introduction to P.I.P. Let's get started on your first lesson.">
                <CopilotView>
                </CopilotView>
            </CopilotStep>

            {/* Habitat two tone (beige top, orange bottom) */}
            <View style={styles.habitat}>
                <View style={styles.habitatTop}/>
                <View style={styles.habitatBottom}/>

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
                <Animated.View style={[styles.pipContainer, {transform: [{translateY: bounce}]}]}>
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