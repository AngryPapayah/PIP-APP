import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../styles/GlobalStyles';
import Typewriter from './animations/TextAnimation';

export default function TextBubble({text, onAnimationComplete}) {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Typewriter
                    style={styles.text}
                    text={text}
                    speed={30}
                    onAnimationComplete={onAnimationComplete}
                />
            </View>
            <View style={styles.tailContainer}>
                <View style={styles.tail}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        maxWidth: '80%',
        alignItems: 'flex-end',
    },
    bubble: {
        backgroundColor: colors?.textCard || '#FFFFFF',
        padding: 12,
        borderRadius: 15,
        borderBottomRightRadius: 0,
        // Fixed size: text scrolls inside
        height: 120,
        width: 260,
    },
    text: {
        fontSize: 25,
        color: '#000',
        fontWeight: 'bold'
    },
    tailContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 15,
        height: 15,
        overflow: 'hidden',
        transform: [{translateY: 15}],
    },
    tail: {
        width: 15,
        height: 15,
        backgroundColor: colors?.textCard || '#FFFFFF',
        borderBottomLeftRadius: 15,
        transform: [{translateY: -15}],
    },
});