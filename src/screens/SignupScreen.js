import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/GlobalStyles";
import { fetchAPI } from "../services/Fetch";
import { useAuth } from "../contexts/AuthContext";
import { useLoading } from "../contexts/LoadingContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function SignupScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setLoading } = useLoading();
    const { t } = useLanguage();

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setErrorMessage(t.errors.distracted);
            return;
        }

        if (email === password) {
            setErrorMessage(t.errors.passwordMatch);
            return;
        }

        setLoading(true);
        try {
            const result = await fetchAPI('register', 'POST', { name, email, password });

            if (result?.error) {
                setErrorMessage(result.error);
                return;
            }

            setErrorMessage('');

            const user = result.data?.user;
            const token = result.data?.token;

            if (user && token) {
                if (user.on_boarding === 0) {
                    user.startTour = true;
                }
                await login(user, token);
            } else {
                navigation.navigate('Login');
            }
        } catch (error) {
            setErrorMessage(t.errors.distracted);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        <Image source={require('../../public/images/pip-head.png')} style={styles.cardImage} resizeMode="contain" />
                        <Text style={styles.title}>{t.ui.createAccount}</Text>
                        <TextInput style={styles.input} placeholder={t.ui.name} value={name} onChangeText={setName} />
                        <TextInput style={styles.input} placeholder={t.ui.email} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                        <TextInput style={styles.input} placeholder={t.ui.password} value={password} onChangeText={setPassword} secureTextEntry />
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                            <Text style={styles.buttonText}>{t.ui.signup}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors?.primary || '#fff' },
    keyboardAvoidingView: { flex: 1, width: '100%' },
    scrollContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    card: { width: '100%', backgroundColor: '#ffffff', padding: 20, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, marginTop: 60 },
    cardImage: { width: 150, height: 150, marginTop: -90, marginBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#e0e0e0', padding: 15, marginBottom: 10, borderRadius: 5 },
    button: { width: '100%', backgroundColor: colors?.primaryButton || '#F09D67', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
    buttonText: { color: colors?.textMain || '#000000', fontWeight: 'bold' },
    errorText: { color: colors?.error || '#FF3B3B', fontWeight: 'bold', marginBottom: 10 },
});