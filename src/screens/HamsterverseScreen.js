import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';

export default function HamsterverseScreen() {
    return (
        <View style={styles.container}>
            <Text style={globalStyles?.text || styles.text}>Hamsterverse</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
    }
});