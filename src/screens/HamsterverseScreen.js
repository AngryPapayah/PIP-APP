import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import TextBubble from '../components/TextBubble.js';

const conversation = [
    "Welcome to P.I.P. Your Parental Informative Program.",
    "I am here to help you with any questions you may have.",
    "Let's start with your first challenge.",
];

export default function HamsterverseScreen() {

    const [messageIndex, setMessageIndex] = useState(0);

    const handleNextMessage = () => {
        if (messageIndex < conversation.length - 1) {
            // Add a 0.7s delay before moving to the next message
            setTimeout(() => {
                setMessageIndex(messageIndex + 1);
            }, 700);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={globalStyles?.text || styles.text}>Hamsterverse</Text>
            <TextBubble
                text={conversation[messageIndex]}
                onAnimationComplete={handleNextMessage}
            />
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