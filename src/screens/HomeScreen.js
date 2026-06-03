import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import TextBubble from '../components/TextBubble.js';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={globalStyles?.text || styles.text}>Challenges</Text>
            {/*<TextBubble text="Welcome to pip this is an app for parents"/>*/}
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