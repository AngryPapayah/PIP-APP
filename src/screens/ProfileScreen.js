import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {colors} from '../styles/GlobalStyles';
import {useAuth} from '../contexts/AuthContext';
import XPBar from '../components/XPBar';
import {CopilotStep, useCopilot, walkthroughable} from "react-native-copilot";
import {useNavigation, useRoute} from "@react-navigation/native";

const hiddenFields = ['id', 'on_boarding', 'current_level_id', 'experience', 'startTour'];

const labelMap = {
    Digital_skill_level: 'Digital skill level',
};

//onboarding process
const CopilotView = walkthroughable(({style, children, ...props}) => (
    <View style={style} {...props}>{children}</View>
));

export default function ProfileScreen() {
    const {logout, user} = useAuth();

    //onboarding
    const navigation = useNavigation()
    const route = useRoute()

    //onboarding
    const {start, copilotEvents} = useCopilot()
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    const xp = user?.xp ?? user?.XP ?? user?.experience_points ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;


    //onboarding
    useEffect(() => {
        const starting = route?.params?.startTour

        if (isLayoutReady && starting) {
            // console.log("LOG: Profile layout klaar. Start profiel-tour!");
            const timer = setTimeout(() => {
                start("ProfileText");
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [isLayoutReady, route?.params]);

    //onboarding
    useEffect(() => {

        copilotEvents.on('start', () => {
            // console.log("COPILOT EVENT: De onboarding-tour is OFFICIEEL gestart op het scherm!");
        });

        copilotEvents.on('stop', () => {
            // console.log("Tour op profile klaar, naar hamsterverse")
            navigation.navigate('Hamsterverse', {startTour: true})
        })

        return () => {
            copilotEvents.off('start')
            copilotEvents.off('stop')
        }
    }, []);


    const formatLabel = (key) => {
        if (labelMap[key]) return labelMap[key];
        return key.replace(/_/g, ' ');
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} onLayout={() => setIsLayoutReady(true)}>
            <CopilotStep name="ProfileText" order={3}
                         text="This is your profile page. Here, you can find your profile details and personal information.">
                <CopilotView>
                    <Text style={styles.title}>Profile</Text>
                </CopilotView>
            </CopilotStep>

            <CopilotStep name="ProfileXP" order={4}
                         text="You can also see your current level and how much XP you've earned as you complete lessons.">
                <CopilotView>
                    <View style={styles.xpCard}>
                        <XPBar currentXP={currentXP} level={level}/>
                    </View>
                </CopilotView>
            </CopilotStep>


            {user && (

                <View style={styles.card}>

                    {Object.entries(user)
                        .filter(([key]) => !hiddenFields.includes(key))
                        .map(([key, value]) => (
                            <View key={key} style={styles.row}>
                                <Text style={styles.label}>{formatLabel(key)}</Text>
                                <Text style={styles.value}>{renderValue(value)}</Text>
                            </View>
                        ))}

                </View>

            )}

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors?.primary || '#fff',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    },
    xpCard: {
        width: '100%',
        marginBottom: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 25,
        borderWidth: 2,
        borderColor: colors?.accent || '#784F4E',
    },
    row: {
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors?.textMain || '#333',
    },
    value: {
        fontSize: 16,
        color: colors?.textMain || '#333',
        marginTop: 4,
    },
    logoutButton: {
        backgroundColor: colors?.error || '#FF3B3B',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});