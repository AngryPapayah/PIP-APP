import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/GlobalStyles";
import TextBubble from "../components/TextBubble";
import { fetchAPI, storeToken, USE_JWT } from "../services/Fetch";
import { useAuth } from "../contexts/AuthContext";
import { useLoading } from "../contexts/LoadingContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const { setLoading } = useLoading();
    const { t } = useLanguage();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [messageIndex, setMessageIndex] = useState(0);

    const conversation = [t.ui.welcome, t.ui.tagline, t.ui.getStarted];

    const handleNextMessage = () => {
        if (messageIndex < conversation.length - 1) {
            setTimeout(() => setMessageIndex(messageIndex + 1), 1000);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage(t.errors.unknownUser);
            return;
        }
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetchAPI('login', 'POST', { email, password });

            if (response.error) {
                setErrorMessage(response.error);
            } else {
                if (USE_JWT && response.token) {
                    await storeToken(response.token);
                }
                login(response.data?.user || response.user);
            }
        } catch (error) {
            setErrorMessage(t.errors.startled);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <TextBubble text={conversation[messageIndex]} onAnimationComplete={handleNextMessage} />
                    <Image source={require('../../public/images/pip-body.png')} style={styles.image} resizeMode="contain" />

                    <TextInput style={styles.input} placeholder={t.ui.email} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder={t.ui.password} value={password} onChangeText={setPassword} secureTextEntry />

                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>{t.ui.login}</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>{t.ui.or}</Text>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.buttonText}>{t.ui.signup}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors?.primary || '#fff' },
    scrollContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    image: { width: 200, height: 200, marginBottom: 10 },
    input: { width: '100%', height: 50, backgroundColor: '#f2f2f2', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { width: '100%', height: 50, backgroundColor: colors?.primaryButton || '#F09D67', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    buttonText: { color: colors?.textMain || '#000', fontSize: 18, fontWeight: 'bold' },
    orText: { fontSize: 16, marginVertical: 10, fontWeight: 'bold' },
    errorText: { color: colors?.error || '#FF3B3B', fontWeight: 'bold', marginBottom: 10 }
});