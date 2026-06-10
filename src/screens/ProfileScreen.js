import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import {useAuth} from '../contexts/AuthContext';

export default function ProfileScreen() {
    const { logout, user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={globalStyles?.text || styles.text}>Profile</Text>
            
            {user && (
                <Text style={styles.nameText}>Welcome, {user.name}!</Text>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nameText: {
        fontSize: 18,
        marginBottom: 30,
        color: colors?.textMain || '#333',
    },
    logoutButton: {
        backgroundColor: colors?.error || '#FF3B3B',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});