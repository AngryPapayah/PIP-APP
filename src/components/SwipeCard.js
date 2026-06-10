import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, PanResponder, Animated, Dimensions} from 'react-native';
import TextBubble from './TextBubble';
import {CustomButton} from './CustomButton';
import {colors} from '../styles/GlobalStyles';
import {fetchAPI} from "../services/Fetch";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

export default function SwipeCard({question, attemptId, onNext, isLastQuestion}) {
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

    const position = useRef(new Animated.ValueXY()).current;

    const handleAnswerLogic = async (direction) => {
        // This function is called AFTER the card has swiped away
        const answer = direction === 'left' ? question.answers[0] : question.answers[1];
        if (!answer) return;

        setHasAnswered(true);
        setIsCorrectAnswer(answer.is_correct === 1 || answer.is_correct === true);

        // Post the answer to the server
        const result = await fetchAPI(`progress/attempts/${attemptId}/answers`, 'POST', {
            questionId: question.id,
            answerId: answer.id,
        });

        if (result?.error) {
            console.error("Something went wrong", result.error);
        }
    };

    const forceSwipe = (direction) => {
        const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
        Animated.timing(position, {
            toValue: {x, y: 0},
            duration: 250,
            useNativeDriver: false,
        }).start(() => handleAnswerLogic(direction));
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        setHasAnswered(false);
        setIsCorrectAnswer(false);
        // Reset position for new card without animation
        position.setValue({x: 0, y: 0});
    }, [question?.id]);


    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({x: gesture.dx, y: gesture.dy});
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    forceSwipe('left');
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg'],
        });

        return {
            ...position.getLayout(),
            transform: [{rotate}],
        };
    };

    let pipImage = require('../../public/images/pip-body.png');
    let pipAltText = "Pip the hamster asking you a question";

    if (hasAnswered) {
        if (isCorrectAnswer) {
            pipImage = require('../../public/images/pip-good.png');
            pipAltText = "Pip the hamster holding a sign with a green checkmark";
        } else {
            pipImage = require('../../public/images/pip-bad.png');
            pipAltText = "Pip the hamster holding a sign with a red cross";
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.pipContainer}>
                <TextBubble
                    text={hasAnswered ? (question?.explanation || '') : (question?.question_text || question?.title || "Loading Question...")}/>
                <Image source={pipImage} style={styles.pipImage} resizeMode="contain" accessible={true}
                       accessibilityLabel={pipAltText}/>
            </View>
            {hasAnswered ? (
                <View style={styles.feedbackContainer}>
                    <View style={styles.nextButtonWrapper}>
                        <CustomButton variant="primary" size="md" onPress={() => onNext(isCorrectAnswer)}>
                            {isLastQuestion ? "Finish" : "Next question >>>"}
                        </CustomButton>
                    </View>
                </View>
            ) : (
                <View style={styles.cardContainer}>
                    <Animated.View
                        style={[styles.card, getCardStyle()]}
                        {...panResponder.panHandlers}
                    >
                        <Text style={styles.trueFalseText}>False or true?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => forceSwipe('left')}>
                                <Text style={styles.thumbStyle}>👎</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => forceSwipe('right')}>
                                <Text style={styles.thumbStyle}>👍</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors?.primary || '#FFDFAD',
    },
    feedbackContainer: {
        height: 420,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        height: 420, // card height + marginBottom
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 300,
        height: 400,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    pipContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginHorizontal: 15,
        marginTop: 40,
    },
    pipImage: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
    trueFalseText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 120,
        marginTop: 10,
    },
    thumbStyle: {
        fontSize: 40,
    },
    nextButtonWrapper: {
        marginVertical: 20,
    }
});