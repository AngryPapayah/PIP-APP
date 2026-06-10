import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image} from 'react-native';
import {colors} from "../styles/GlobalStyles";
import {CommonActions} from '@react-navigation/native';
import XPBar from '../components/XPBar';
import TextBubble from '../components/TextBubble';

export default function ResultScreen({navigation}) {
    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'HomeScreen'}],
            })
        );
    };

    const goToHamsterverse = () => {
        // First, reset the Home stack, then navigate to the Hamsterverse tab.
        // A slight delay might be needed if there are race conditions, but dispatching actions sequentially is usually safe.
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'HomeScreen'}],
            })
        );
        navigation.navigate('Hamsterverse');
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.content}>
                <View style={styles.characterContainer}>
                    {/*The tip text of the lesson*/}
                    <TextBubble text="Good job!"/>
                    <Image
                        source={require('../../public/images/pip-body.png')}
                        style={styles.characterImage}
                    />
                </View>

                <View style={styles.xpBarSection}>
                    <XPBar/>
                </View>

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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    characterContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    characterImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginTop: -10, // Bring the image a bit closer to the text bubble
    },
    xpBarSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors?.primary || '#FFDFAD',
        width: '100%',
        alignItems: 'center',
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
        color: colors.textMain || '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
