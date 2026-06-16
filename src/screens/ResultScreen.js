// C:/Users/ashfa/Development/TLE4/PIP-APP/src/screens/ResultScreen.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Modal } from 'react-native';
import { colors } from "../styles/GlobalStyles";
import { CommonActions } from '@react-navigation/native';
import XPBar from '../components/XPBar';
import TextBubble from '../components/TextBubble';
import { useLanguage } from '../contexts/LanguageContext';

export default function ResultScreen({ navigation, route }) {
    const score = route?.params?.score || 0;
    const { t } = useLanguage();
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
        switch(level) {
            case 2:
                return { name: 'Food Bowl', image: require('../../public/images/food.png'), description: 'You unlocked the Food Bowl!' };
            case 3:
                return { name: 'Hamster Wheel', image: require('../../public/images/wheel.png'), description: 'You unlocked the Hamster Wheel!' };
            default:
                return null;
        }
    };

    const handleLevelUp = (newLevel) => {
        if (!hasShownLevelUp) {
            setHasShownLevelUp(true);
            setBubbleText(`Congratulations! You are now level ${newLevel}!`);
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
                routes: [{ name: 'Main' }],
            })
        );
    };

    const goToHamsterverse = () => {
        navigation.navigate('Main', {
            screen: 'Tabs',
            params: {
                screen: 'Hamsterverse'
            }
        });
    };

    const closeRewardModal = () => {
        setShowRewardModal(false);
        setNewlyUnlockedReward(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.characterContainer}>
                    <TextBubble text={bubbleText} />
                    <Image source={require('../../public/images/pip-body.png')} style={styles.characterImage} />
                </View>
                <Text style={styles.scoreText}>{t.ui.score}: {score}</Text>
                <View style={styles.xpBarSection}>
                    <XPBar refreshTrigger={refreshXP} onLevelUp={handleLevelUp}/>
                </View>
                <TouchableOpacity style={styles.button} onPress={goToHamsterverse}>
                    <Text style={styles.buttonText}>{t.ui.hamsterverse}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goToHome}>
                    <Text style={styles.buttonText}>{t.ui.home}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showRewardModal} transparent={true} animationType="fade" onRequestClose={closeRewardModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeRewardModal}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                        <View style={styles.rewardContainer}>
                            <Text style={styles.rewardTitle}>Reward Unlocked!</Text>
                            {newlyUnlockedReward && (
                                <>
                                    <Image source={newlyUnlockedReward.image} style={styles.rewardImage} resizeMode="contain" />
                                    <Text style={styles.rewardName}>{newlyUnlockedReward.name}</Text>
                                    <Text style={styles.rewardDescription}>{newlyUnlockedReward.description}</Text>
                                </>
                            )}
                            <Text style={styles.rewardFooter}>You can see your rewards in the Hamsterverse!</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#F4E1C1',
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
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors?.textMain || '#141414',
    },
    xpBarSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
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
        color: colors.textMain || '#141414',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 25,
        padding: 24,
        width: '85%',
        alignItems: 'center',
        backgroundColor: colors?.primary || '#F4E1C1',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors?.textMain || '#141414',
    },
    rewardContainer: {
        alignItems: 'center',
    },
    rewardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors?.primaryButton || '#D97706',
        marginBottom: 16,
    },
    rewardImage: {
        width: 120,
        height: 120,
        marginVertical: 16,
    },
    rewardName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    rewardDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    rewardFooter: {
        fontSize: 14,
        color: colors?.accent || '#784F4E',
        fontStyle: 'italic',
    },
});
