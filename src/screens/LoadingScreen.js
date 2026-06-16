import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Easing } from 'react-native';
import { colors } from '../styles/GlobalStyles';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {
    const { t } = useLanguage();
    const [isAdhdMode, setIsAdhdMode] = useState(false);
    const [isSchizoMode, setIsSchizoMode] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [dots, setDots] = useState('.');

    const bobAnim = useRef(new Animated.Value(0)).current;
    const randomX = useRef(new Animated.Value(0)).current;
    const randomY = useRef(new Animated.Value(0)).current;
    const launchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const currentDuration = isAdhdMode ? 100 : 400;
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(bobAnim, {
                    toValue: -20,
                    duration: currentDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(bobAnim, {
                    toValue: 0,
                    duration: currentDuration,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [isAdhdMode, bobAnim]);

    useEffect(() => {
        if (!isSchizoMode || isLaunching) {
            Animated.parallel([
                Animated.timing(randomX, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(randomY, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
            return;
        }

        const teleportIntervalDuration = isAdhdMode ? 200 : 800;

        const teleport = () => {
            const pipSize = 150;
            const newX = Math.random() * (width - pipSize) - (width / 2 - pipSize / 2);
            const newY = Math.random() * (height - pipSize) - (height / 2 - pipSize / 2);

            Animated.parallel([
                Animated.timing(randomX, { toValue: newX, duration: 0, useNativeDriver: true }),
                Animated.timing(randomY, { toValue: newY, duration: 0, useNativeDriver: true }),
            ]).start();
        };

        teleport();
        const interval = setInterval(teleport, teleportIntervalDuration);
        return () => clearInterval(interval);
    }, [isSchizoMode, isAdhdMode, isLaunching]);

    const handleLaunch = () => {
        if (isLaunching) return;
        setIsLaunching(true);

        Animated.timing(launchAnim, {
            toValue: -height,
            duration: 800,
            easing: Easing.back(1),
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                launchAnim.setValue(height);
                Animated.timing(launchAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }).start(() => setIsLaunching(false));
            }, 1000);
        });
    };

    const scaleY = bobAnim.interpolate({
        inputRange: [-20, 0],
        outputRange: [1.05, 0.85],
    });

    const scaleX = bobAnim.interpolate({
        inputRange: [-20, 0],
        outputRange: [0.95, 1.20],
    });

    const anchorOffset = bobAnim.interpolate({
        inputRange: [-20, 0],
        outputRange: [-11.25, 18.75],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.pipWrapperBase,
                isSchizoMode ? styles.pipWrapperSchizo : styles.pipWrapperNormal,
                {
                    transform: [
                        { translateX: randomX },
                        { translateY: Animated.add(randomY, launchAnim) }
                    ]
                }
            ]}>
                <Animated.Image
                    source={require('../../public/images/pip-body.png')}
                    style={[
                        styles.pip,
                        {
                            transform: [
                                { translateY: Animated.add(bobAnim, anchorOffset) },
                                { scaleY: scaleY },
                                { scaleX: scaleX }
                            ],
                        },
                    ]}
                    resizeMode="contain"
                />
            </Animated.View>

            <Text style={styles.text}>{t.loading.title}{dots}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.launchButton]}
                    onPress={handleLaunch}
                    disabled={isLaunching}
                >
                    <Text style={styles.buttonText}>{t.loading.launch}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.schizoButton, isSchizoMode && styles.schizoButtonActive]}
                    onPress={() => setIsSchizoMode(!isSchizoMode)}
                >
                    <Text style={styles.buttonText}>
                        {isSchizoMode ? t.loading.normalMode : t.loading.schizoMode}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.adhdButton, isAdhdMode && styles.adhdButtonActive]}
                    onPress={() => setIsAdhdMode(!isAdhdMode)}
                >
                    <Text style={styles.buttonText}>
                        {isAdhdMode ? t.loading.tooMuch : t.loading.adhdMode}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
    pipWrapperBase: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    pipWrapperNormal: {
        height: 180,
    },
    pipWrapperSchizo: {
        position: 'absolute',
        width: 150,
        height: 150,
    },
    pip: {
        width: 150,
        height: 150,
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textMain,
        marginTop: 20,
        textAlign: 'center',
        minWidth: 120,
        zIndex: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 15,
        width: '80%',
        borderRadius: 25,
        elevation: 3,
        zIndex: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    adhdButton: {
        backgroundColor: colors.primaryButton,
    },
    adhdButtonActive: {
        backgroundColor: colors.error || '#FF3B3B',
    },
    schizoButton: {
        backgroundColor: colors.navbar,
    },
    schizoButtonActive: {
        backgroundColor: colors.accent || '#784F4E',
    },
    launchButton: {
        backgroundColor: '#4CAF50',
    }
});