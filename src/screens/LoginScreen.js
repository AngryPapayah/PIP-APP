import React, {useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {globalStyles, colors} from "../styles/GlobalStyles";
import TextBubble from "../components/TextBubble";
import {fetchAPI} from "../services/Fetch";
import {useAuth} from "../contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';


const conversation = [
    "Welcome to P.I.P.",
    "Your Parental Informative Program.",
    "Let's get started!"
];

export default function LoginScreen({navigation}) {
    const { login } = useAuth();
    // login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);


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

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            const data = await fetchAPI('login', 'POST', {
                email,
                password
            });
            console.log(JSON.stringify(data, null, 2));

            if (!data.success) {
                setErrorMessage(
                    data.message || data.error || 'Login failed'
                );
                return;
            }

            console.log('Login successful:', data);

            await login(
                data.data.user,
                data.data.token
            );

        } catch (error) {
            console.error(error);
            setErrorMessage(
                'An unexpected error occurred. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };
    const handleRegister = () => {
        navigation.navigate('Signup');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
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

                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}> OR </Text>

                    <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
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
    },
    errorText: {
        color: colors?.error || '#FF3B3B',
        fontWeight: 'bold',
        marginBottom: 10,
    },
});