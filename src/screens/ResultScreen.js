import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { colors } from "../styles/GlobalStyles";
import { CommonActions } from '@react-navigation/native';
import XPBar from '../components/XPBar';
import TextBubble from '../components/TextBubble';
import { useLanguage } from '../contexts/LanguageContext';

export default function ResultScreen({ navigation, route }) {
    const score = route?.params?.score || 0;
    const { t } = useLanguage();

    const goToHome = () => {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'HomeScreen' }] }));
    };

    const goToHamsterverse = () => {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'HomeScreen' }] }));
        navigation.navigate('Hamsterverse');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.characterContainer}>
                    <TextBubble text={t.success.goodJob} />
                    <Image source={require('../../public/images/pip-body.png')} style={styles.characterImage} />
                </View>
                <Text style={styles.scoreText}>{t.ui.score}: {score}</Text>
                <View style={styles.xpBarSection}><XPBar /></View>
                <TouchableOpacity style={styles.button} onPress={goToHamsterverse}>
                    <Text style={styles.buttonText}>{t.ui.hamsterverse}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goToHome}>
                    <Text style={styles.buttonText}>{t.ui.home}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors?.primary || '#fff' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    characterContainer: { alignItems: 'center', alignSelf: 'flex-end', marginRight: 20, marginBottom: 20 },
    characterImage: { width: 150, height: 150, resizeMode: 'contain', marginTop: -10 },
    scoreText: { fontSize: 24, fontWeight: 'bold', color: colors?.textMain || '#000', marginBottom: 20 },
    xpBarSection: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors?.primary || '#FFDFAD', width: '100%', alignItems: 'center' },
    button: { backgroundColor: colors.secondary, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, marginVertical: 10, width: '80%', alignItems: 'center' },
    buttonText: { color: colors.textMain || '#000000', fontSize: 18, fontWeight: 'bold' }
});