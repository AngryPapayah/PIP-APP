import React, {useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from "react-native";
import {globalStyles, colors} from "../styles/GlobalStyles";
import TextBubble from "../components/TextBubble";

const conversation = [
    "Welcome to P.I.P.",
    "Your Parental Informative Program.",
    "Let's get started!"
];

export default function LoginScreen({navigation}) {
    // login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // textbubble
    const [messageIndex, setMessageIndex] = useState(0);

    const handleNextMessage = () => {
        if (messageIndex < conversation.length - 1) {
            // Add a 1s delay before moving to the next message
            setTimeout(() => {
                setMessageIndex(messageIndex + 1);
            }, 1000);
        }
    };

    const handleLogin = () => {
        // Basic login logic
        console.log('Email:', email);
        console.log('Password:', password);
        navigation.navigate('Main');
    };

    const handleRegister = () => {
        navigation.navigate('Signup');
        // console.log('Register tapped');
    };

    return (
        <View style={styles.container}>
            <TextBubble
                text={conversation[messageIndex]}
                onAnimationComplete={handleNextMessage}
            />
            <Image
                source={require('../../public/images/pip-body.png')}
                style={{width: 200, height: 200, marginLeft: 15,}}
                resizeMode="contain"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.orText}> OR </Text>

            <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign up</Text>
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
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors?.primaryButton || '#F09D67',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    registerButton: {
        backgroundColor: colors?.primaryButton || '#F09D67',
    },
    buttonText: {
        color: colors?.textMain || '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 16,
        color: colors?.textMain || '#000000',
        marginVertical: 10,
        fontWeight: 'bold',
    }
});