import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {globalStyles, colors} from "../styles/GlobalStyles";
import {fetchAPI} from "../services/Fetch";

export default function SignupScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (email === password) {
            setErrorMessage('Password cannot be the same as your email.');
            return;
        }

        setLoading(true);
        const result = await fetchAPI('register', 'POST', {name, email, password});
        setLoading(false);

        if (result?.error) {
            setErrorMessage(result.error);
            return;
        }

        setErrorMessage('');
        Alert.alert(
            "Registration Successful",
            "You can now log in with your new account.",
            [
                { text: "OK", onPress: () => navigation.navigate('Login') }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Image
                    source={require('../../public/images/pip-head.png')}
                    style={styles.cardImage}
                    resizeMode="contain"
                />

                <Text style={globalStyles?.title || styles.title}>Create an Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
    card: {
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 60,
    },
    cardImage: {
        width: 150,
        height: 150,
        marginTop: -90,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        width: '100%',
        backgroundColor: colors?.primaryButton || '#F09D67',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: colors?.textMain || '#000000',
        fontWeight: 'bold',
    },
    errorText: {
        color: colors?.error || '#FF3B3B',
        fontWeight: 'bold',
        marginBottom: 10,
    },
});