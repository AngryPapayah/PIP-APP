import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import {useAuth} from '../contexts/AuthContext';
import XPBar from '../components/XPBar';

const hiddenFields = ['id', 'on_boarding', 'current_level_id', 'experience'];

const labelMap = {
    Digital_skill_level: 'Digital skill level',
};

export default function ProfileScreen() {
    const { logout, user } = useAuth();

    const xp = user?.xp ?? user?.XP ?? user?.experience_points ?? 0;
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
                <XPBar currentXP={currentXP} level={level} />
            </View>

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