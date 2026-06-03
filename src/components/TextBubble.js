import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/GlobalStyles';

export default function TextBubble({text}) {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Text style={styles.text}>{text}</Text>
            </View>
            <View style={styles.tailContainer}>
                <View style={styles.tail} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        maxWidth: '80%',
        alignItems: 'flex-start',
    },
    bubble: {
        backgroundColor: colors?.textCard || '#FFFFFF',
        padding: 12,
        borderRadius: 15,
        borderBottomLeftRadius: 0, 
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
    tailContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 15,
        height: 15,
        overflow: 'hidden',
        transform: [{ translateY: 15 }],
    },
    tail: {
        width: 15,
        height: 15,
        backgroundColor: colors?.textCard || '#FFFFFF',
        borderBottomRightRadius: 15,
        transform: [{ translateY: -15 }],
    },
});