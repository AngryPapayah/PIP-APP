import React, {useEffect, useState, useCallback, useRef} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/GlobalStyles';
import ModulesList from "./courses/modules/ModulesList";
import {CopilotStep, useCopilot, walkthroughable} from "react-native-copilot";
import {useNavigation, useFocusEffect} from "@react-navigation/native";
import {useAuth} from "../contexts/AuthContext";
import {useLanguage} from '../contexts/LanguageContext';

const CopilotView = walkthroughable(({style, children, ...props}) => (
    <View style={style} {...props}>{children}</View>
));

export default function HomeScreen() {
    const navigation = useNavigation();
    const {user, refreshUser} = useAuth();
    const {t} = useLanguage();
    const {start, copilotEvents} = useCopilot();
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const hasStartedTour = useRef(false);

    useFocusEffect(
        useCallback(() => {
            if (user?.on_boarding === 1) {
                refreshUser();
            }
        }, [refreshUser, user?.on_boarding])
    );

    useEffect(() => {
        if (isLayoutReady && user?.on_boarding === 0 && user?.startTour === true && !hasStartedTour.current) {
            hasStartedTour.current = true;
            const timer = setTimeout(() => {
                start();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isLayoutReady, user?.on_boarding, user?.startTour, start]);

    useEffect(() => {
        copilotEvents.on('stop', () => {
            navigation.navigate('Profile', {startTour: true});
        });
        return () => {
            copilotEvents.off('start');
            copilotEvents.off('stop');
        };
    }, [navigation, copilotEvents]);

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.container} onLayout={() => setIsLayoutReady(true)}>
                <CopilotStep name="WelcomeText" order={1} text={t.onboarding.homeWelcomeText}>
                    <CopilotView>
                        <Text style={styles.text}>{t.ui.yourModules}</Text>
                    </CopilotView>
                </CopilotStep>

                <CopilotStep name="ModulesList" order={2} text={t.onboarding.homeModulesText}>
                    <CopilotView>
                        <ModulesList/>
                    </CopilotView>
                </CopilotStep>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: colors?.primary || '#F4E1C1',
    },
    container: {
        backgroundColor: colors?.primary || '#F4E1C1',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50
    },
    text: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    }
});