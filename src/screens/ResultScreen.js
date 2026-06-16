import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image , Modal} from 'react-native';
import { colors } from "../styles/GlobalStyles";
import { CommonActions } from '@react-navigation/native';
import XPBar from '../components/XPBar';
import TextBubble from '../components/TextBubble';
import { useLanguage } from '../contexts/LanguageContext';

export default function ResultScreen({ navigation, route }) {
    const score = route?.params?.score || 0;
    const { t } = useLanguage();
    const [refreshXP, setRefreshXP] = useState(0);
    const [bubbleText, setBubbleText] = useState(`Good job!`);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [newlyUnlockedReward, setNewlyUnlockedReward] = useState(null);
    const [hasShownLevelUp, setHasShownLevelUp] = useState(false);

    // Forceer een refresh van de XPBar na het laden van de result screen
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setRefreshXP(Date.now());
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Reset hasShownLevelUp wanneer de component mount (nieuwe result screen)
    React.useEffect(() => {
        setHasShownLevelUp(false);
        setBubbleText(`Good job!`);
    }, []);

    // Bepaal welke reward er is vrijgespeeld op basis van level
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

    // Handler for level-up van XPBar
    const handleLevelUp = (newLevel, oldLevel) => {
        // Alleen level-up melding tonen als we die nog niet hebben getoond
        if (!hasShownLevelUp) {
            setHasShownLevelUp(true);
            setBubbleText(`Congratulations! You are now level ${newLevel}!`);
        }

        // Check if there's a reward for this level
        const reward = getRewardForLevel(newLevel);
        if (reward) {
            setNewlyUnlockedReward(reward);
            setShowRewardModal(true);
        }
    };

    const goToHome = () => {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'HomeScreen' }] }));
    };

    const goToHamsterverse = () => {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'HomeScreen' }] }));
        navigation.navigate('Hamsterverse');
    };

    const closeRewardModal = () => {
        setShowRewardModal(false);
        setNewlyUnlockedReward(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.characterContainer}>
                    <TextBubble text={t.success.goodJob} />
                    <Image source={require('../../public/images/pip-body.png')} style={styles.characterImage} />
                    <TextBubble text={bubbleText}/>
                    <Image
                        source={require('../../public/images/pip-body.png')}
                        style={styles.characterImage}
                    />
                </View>
                <Text style={styles.scoreText}>{t.ui.score}: {score}</Text>
                <View style={styles.xpBarSection}><XPBar refreshTrigger={refreshXP} onLevelUp={handleLevelUp}/></View>
                <TouchableOpacity style={styles.button} onPress={goToHamsterverse}>
                    <Text style={styles.buttonText}>{t.ui.hamsterverse}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goToHome}>
                    <Text style={styles.buttonText}>{t.ui.home}</Text>
                </TouchableOpacity>
            </View>

            {/* Reward Popup Modal */}
            <Modal
                visible={showRewardModal}
                transparent={true}
                animationType="fade"
                onRequestClose={closeRewardModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.primary || '#F4E1C1' }]}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeRewardModal}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>

                        <View style={styles.rewardContainer}>
                            <Text style={styles.rewardTitle}>Reward Unlocked!</Text>

                            {newlyUnlockedReward && (
                                <>
                                    <Image
                                        source={newlyUnlockedReward.image}
                                        style={styles.rewardImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.rewardName}>{newlyUnlockedReward.name}</Text>
                                    <Text style={styles.rewardDescription}>{newlyUnlockedReward.description}</Text>
                                </>
                            )}

                            <Text style={styles.rewardFooter}>
                                You can see your rewards in the Hamsterverse!
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
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
        alignSelf: 'flex-end',
        marginRight: 20,
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
        backgroundColor: colors?.primary || '#F4E1C1',
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
    // Modal styles
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
        position: 'relative',
        backgroundColor: colors?.primary || '#F4E1C1',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors?.textMain || '#141414',
    },
    rewardContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    rewardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors?.primaryButton || '#D97706',
        marginBottom: 16,
        textAlign: 'center',
    },
    rewardImage: {
        width: 120,
        height: 120,
        marginVertical: 16,
    },
    rewardName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors?.textMain || '#141414',
        marginBottom: 8,
    },
    rewardDescription: {
        fontSize: 16,
        color: colors?.textMain || '#141414',
        textAlign: 'center',
        marginBottom: 16,
    },
    rewardFooter: {
        fontSize: 14,
        color: colors?.accent || '#784F4E',
        textAlign: 'center',
        marginTop: 12,
        fontStyle: 'italic',
    },
});