import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import {useAuth} from '../contexts/AuthContext';
import XPBar from '../components/XPBar';
import {fetchAPI} from "../services/Fetch";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const hiddenFields = ['id', 'on_boarding', 'current_level_id', 'experience'];

const labelMap = {
    Digital_skill_level: 'Digital skill level',
};

// Checkt of een datum (van de backend) vandaag is
function isToday(dateString) {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return d.getFullYear() === today.getFullYear()
        && d.getMonth() === today.getMonth()
        && d.getDate() === today.getDate();
}

export default function ProfileScreen() {
    const {logout, user} = useAuth();
    const [streak, setStreak] = useState(null);

    useEffect(() => {
        console.log("User object in profile:", user);
        if (user?.id) {
            getStreak()
        }
    }, [user]);

    // Streak functie
    async function getStreak() {
        try {
            // console.log(`Fetching streak from: users/${user.id}/streak`);
            const data = await fetchAPI(`users/${user.id}/streak`, 'GET')
            // console.log("Streak API response:", data);

            if (data && !data.error && data.status !== 404) {
                const streakData = data.data || data;
                const result = Array.isArray(streakData) ? (streakData[0] || {}) : (streakData || {});

                // Backend telt dag 1 nog als streak 0 ("startpunt"). Tot dat is aangepast,
                // tonen we 'm hier al als 1 -- maar alleen als de gebruiker vandaag echt
                // actief was. Is last_active_date ouder dan vandaag, dan is de streak
                // gewoon verbroken en moet 0 ook 0 blijven.
                const justStartedToday = result.current_streak === 0 && isToday(result.last_active_date);

                setStreak({
                    ...result,
                    current_streak: justStartedToday ? 1 : (result.current_streak || 0),
                    highest_streak: result.highest_streak || 0,
                });
            } else {
                // console.error("Could not fetch streak, backend might be down or endpoint is wrong. Setting to 0.", data?.error);
                setStreak({current_streak: 0, highest_streak: 0});
            }
        } catch (error) {
            // console.error("An error occurred while fetching the streak", error);
            setStreak({current_streak: 0, highest_streak: 0});
        }
    }

    const xp = user?.xp ?? user?.XP ?? user?.experience_points ?? user?.experience ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={globalStyles?.text || styles.title}>Profile</Text>

            <View style={styles.xpCard}>
                <XPBar currentXP={currentXP} level={level}/>
            </View>

            {streak && (
                <View style={[styles.card, styles.streakContainer]}>
                    <Icon name="fire" size={24} color="#FFA500" style={styles.streakIcon}/>
                    <View>
                        <Text style={styles.streakText}>
                            Streak: {streak?.current_streak || 0} {(streak?.current_streak === 1) ? 'day' : 'days'}
                        </Text>
                        <Text style={styles.highestStreakText}>
                            Highest: {streak?.highest_streak || 0}
                        </Text>
                    </View>
                </View>
            )}

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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors?.secondary || '#FFFFFF',
    },
    streakIcon: {
        marginRight: 10,
    },
    streakText: {
        color: colors?.textMain || '#141414',
        fontSize: 18,
        fontWeight: 'bold',
    },
    highestStreakText: {
        color: colors?.textMain || '#141414',
        fontSize: 12,
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