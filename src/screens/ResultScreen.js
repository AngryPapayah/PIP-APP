import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from "../styles/GlobalStyles";

export default function ResultScreen() {
    return (
        <view style={styles.container}>


        </view>
    )
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
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    }
});