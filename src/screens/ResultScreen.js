import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors} from "../styles/GlobalStyles";
import { CommonActions } from '@react-navigation/native';

export default function ResultScreen({navigation}) {
    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            })
        );
    };

    const goToHamsterverse = () => {
        // First, reset the Home stack, then navigate to the Hamsterverse tab.
        // A slight delay might be needed if there are race conditions, but dispatching actions sequentially is usually safe.
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            })
        );
        navigation.navigate('Hamsterverse');
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>RESULTSCREEN</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={goToHamsterverse}
            >
                <Text style={styles.buttonText}>Hamsterverse</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={goToHome}
            >
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
        </View>
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
        marginVertical: 20,
        color: colors.textMain || '#000000',
    },
    button: {
        backgroundColor: colors.secondary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});