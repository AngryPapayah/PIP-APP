import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Modal} from 'react-native';
import {colors} from "../styles/GlobalStyles";
import {CommonActions} from '@react-navigation/native';
import XPBar from '../components/XPBar';
import TextBubble from '../components/TextBubble';
import {useLanguage} from '../contexts/LanguageContext';
import {useAuth} from '../contexts/AuthContext';

export default function ResultScreen({navigation, route}) {
    const score = route?.params?.score || 0;
    const {t} = useLanguage();
    const {user} = useAuth();
    const [refreshXP, setRefreshXP] = useState(0);
    const [bubbleText, setBubbleText] = useState(t.success.goodJob);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [newlyUnlockedReward, setNewlyUnlockedReward] = useState(null);
    const [hasShownLevelUp, setHasShownLevelUp] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRefreshXP(Date.now());
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setHasShownLevelUp(false);
        setBubbleText(t.success.goodJob);
    }, [t]);

    const getRewardForLevel = (level) => {
        switch (level) {
            case 2:
                return {
                    name: t.rewards.foodBowl.name,
                    image: require('../../public/images/food.png'),
                    description: t.rewards.foodBowl.description
                };
            case 3:
                return {
                    name: t.rewards.hamsterWheel.name,
                    image: require('../../public/images/wheel.png'),
                    description: t.rewards.hamsterWheel.description
                };
            default:
                return null;
        }
    };

    const handleLevelUp = (newLevel, oldLevel) => {
        if (!hasShownLevelUp) {
            setHasShownLevelUp(true);
            setBubbleText(`${t.success.levelUpMessage} ${newLevel}!`);
        }
        const reward = getRewardForLevel(newLevel);
        if (reward) {
            setNewlyUnlockedReward(reward);
            setShowRewardModal(true);
        }
    };

    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Main', state: {routes: [{name: 'Home'}]}}],
            })
        );
    };

    const goToHamsterverse = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Main', state: {routes: [{name: 'Hamsterverse'}]}}],
            })
        );
    };

    const closeRewardModal = () => {
        setShowRewardModal(false);
        setNewlyUnlockedReward(null);
    };

    const xp = user?.xp ?? user?.XP ?? user?.experience_points ?? user?.experience ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;

    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.characterContainer}>
                    <TextBubble text={bubbleText}/>
                    <Image source={require('../../public/images/pip-body.png')} style={styles.characterImage}/>
                </View>
                <Text style={styles.scoreText}>{t.ui.score}: {score}%</Text>
                <View style={styles.xpBarSection}>
                    <XPBar currentXP={currentXP} level={level} refreshTrigger={refreshXP} onLevelUp={handleLevelUp}/>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={goToHamsterverse}>
                    <Text style={styles.buttonText}>{t.ui.hamsterverse || "Hamsterverse"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goToHome}>
                    <Text style={styles.buttonText}>{t.ui.home || "Home"}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showRewardModal} transparent={true} animationType="fade" onRequestClose={closeRewardModal}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, {backgroundColor: colors.primary || '#F4E1C1'}]}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeRewardModal}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                        <View style={styles.rewardContainer}>
                            <Text style={styles.rewardTitle}>{t.rewards.unlockedTitle}</Text>
                            {newlyUnlockedReward && (
                                <>
                                    <Image source={newlyUnlockedReward.image} style={styles.rewardImage}
                                           resizeMode="contain"/>
                                    <Text style={styles.rewardName}>{newlyUnlockedReward.name}</Text>
                                    <Text style={styles.rewardDescription}>{newlyUnlockedReward.description}</Text>
                                </>
                            )}
                            <Text style={styles.rewardFooter}>{t.rewards.footerNote}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: colors?.primary || '#F4E1C1'},
    content: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    characterContainer: {alignItems: 'center', alignSelf: 'center', marginBottom: 20},
    characterImage: {width: 150, height: 150, resizeMode: 'contain'},
    scoreText: {fontSize: 24, fontWeight: 'bold', color: colors?.textMain || '#141414'},
    xpBarSection: {paddingHorizontal: 16, paddingVertical: 12, width: '100%', alignItems: 'center'},
    buttonContainer: {width: '100%', alignItems: 'center', marginBottom: 20},
    button: {
        backgroundColor: colors.secondary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center'
    },
    buttonText: {color: colors.textMain || '#141414', fontSize: 18, fontWeight: 'bold'},
    modalOverlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center'},
    modalContent: {borderRadius: 25, padding: 24, width: '85%', alignItems: 'center', position: 'relative'},
    closeButton: {position: 'absolute', top: 12, right: 12},
    closeButtonText: {fontSize: 18, fontWeight: 'bold'},
    rewardContainer: {alignItems: 'center'},
    rewardTitle: {fontSize: 22, fontWeight: 'bold', color: colors?.primaryButton || '#D97706', marginBottom: 16},
    rewardImage: {width: 120, height: 120, marginVertical: 16},
    rewardName: {fontSize: 20, fontWeight: 'bold'},
    rewardDescription: {fontSize: 16, textAlign: 'center'},
    rewardFooter: {fontSize: 14, fontStyle: 'italic', marginTop: 12}
});