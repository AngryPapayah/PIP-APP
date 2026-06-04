import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { colors } from '../styles/GlobalStyles';

const { width: screenWidth } = Dimensions.get('window');

export default function ProgressBar({ currentStep = 1, totalSteps = 5 }) {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progress = (currentStep - 1) / (totalSteps - 1) || 0;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentStep]);

    const lineWidth = screenWidth - 80;
    const animatedWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, lineWidth],
    });

    return (
        <View style={styles.container}>
            <View style={[styles.track, { width: lineWidth }]}>
                <Animated.View style={[styles.filledTrack, { width: animatedWidth }]} />

                <View style={[styles.stepsContainer, { width: lineWidth }]}>
                    {[...Array(totalSteps)].map((_, i) => {
                        const step = i + 1;
                        const isDone = step < currentStep;
                        const isActive = step === currentStep;

                        return (
                            <View key={step} style={[
                                styles.step,
                                (isDone || isActive) && styles.filledStep,
                                isActive && styles.activeStep
                            ]}>
                                <Text style={[(isDone || isActive) && styles.stepTextLight]}>
                                    {step}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    track: {
        height: 6,
        backgroundColor: colors.progressBarBackground,
        borderRadius: 10,
        position: 'relative',
    },
    filledTrack: {
        position: 'absolute',
        left: 0,
        height: 6,
        borderRadius: 10,
        backgroundColor: colors.progressBarFiller,
    },
    stepsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: -11,
    },
    step: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.progressBarBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 8,
    },
    filledStep: {
        backgroundColor: colors.progressBarFiller,
    },
    activeStep: {
        transform: [{ scale: 1.1 }],
    },
    stepTextLight: {
        color: '#FFFFFF',
    },
});