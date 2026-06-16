import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/GlobalStyles';
import ModulesList from "./courses/modules/ModulesList";
import {CopilotStep, useCopilot, walkthroughable} from "react-native-copilot";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../contexts/AuthContext";

//onboarding
const CopilotView = walkthroughable(({style, children, ...props}) => (
    <View style={style} {...props}>{children}</View>
))

export default function HomeScreen() {

    const navigation = useNavigation()
    const {user} = useAuth()

    //onboarding
    const {start, copilotEvents} = useCopilot()
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    //onboarding
    if (user?.on_boarding === 0) {
        useEffect(() => {
            // console.log("Check: Is user ingelogd?", user);
            // console.log("Check: Onboarding status van user:", user?.on_boarding);
            // console.log("Check: startTour vlag aanwezig?", user?.startTour);

            if (isLayoutReady && (user?.on_boarding === 0 || user?.startTour === true)) {

                const timer = setTimeout(() => {
                    start()
                }, 600)

                return () => {
                    clearTimeout(timer)
                }
            }
        }, [isLayoutReady, user]);

        //onboarding
        useEffect(() => {

            copilotEvents.on('stop', () => {
                navigation.navigate('Profile', {startTour: true})
            })

            return () => {
                copilotEvents.off('start')
                copilotEvents.off('stop')
            }
        }, []);

    }


    return (
        <View style={styles.container} onLayout={() => setIsLayoutReady(true)}>
            <CopilotStep name="WelcomeText" order={1}
                         text="Welcome to your dashboard. Here, you'll find an overview of the learning modules available across a range of digital categories.">
                <CopilotView>
                    <Text style={styles.text}>Your Modules</Text>
                </CopilotView>
            </CopilotStep>

            <CopilotStep name="ModulesList" order={2}
                         text="These are your learning modules. Select a module to choose a lesson and strengthen your digital knowledge.">
                <CopilotView>
                    <ModulesList></ModulesList>
                </CopilotView>
            </CopilotStep>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#F4E1C1',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50
    },
    text: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    }
});