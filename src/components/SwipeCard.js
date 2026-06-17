import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, PanResponder, Animated, Dimensions} from 'react-native';
import TextBubble from './TextBubble';
import {CustomButton} from './CustomButton';
import {colors} from '../styles/GlobalStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

export default function SwipeCard({question, onNext, isLastQuestion}) {
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);
    const position = useRef(new Animated.ValueXY()).current;

    const handleAnswerLogic = (direction) => {
        const answers = question?.answers || [];
        const answerIndex = direction === 'left' ? 0 : 1;

        if (answers.length === 0) {
            setHasAnswered(true);
            return;
        }

        const answer = answers[answerIndex] || answers[0];
        setSelectedAnswerId(answer.id);
        setHasAnswered(true);
        setIsCorrectAnswer(answer.is_correct === 1 || answer.is_correct === true);
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
        setSelectedAnswerId(null);
        position.setValue({x: 0, y: 0});
    }, [question?.id]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({x: gesture.dx, y: gesture.dy});
            },
            onPanResponderRelease: (event, gesture) => {
                if (hasAnswered) return;
                if (gesture.dx > SWIPE_THRESHOLD) forceSwipe('right');
                else if (gesture.dx < -SWIPE_THRESHOLD) forceSwipe('left');
                else resetPosition();
            },
        })
    ).current;

    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg'],
        });
        return {...position.getLayout(), transform: [{rotate}]};
    };

    let pipImage = require('../../public/images/pip-body.png');
    if (hasAnswered) {
        pipImage = isCorrectAnswer ? require('../../public/images/pip-good.png') : require('../../public/images/pip-bad.png');
    }

    return (
        <View style={styles.container}>
            <View style={styles.pipContainer}>
                <TextBubble
                    text={hasAnswered ? (question?.explanation || '') : (question?.question_text || "Loading Question...")}/>
                <Image source={pipImage} style={styles.pipImage} resizeMode="contain"/>
            </View>
            {hasAnswered ? (
                <View style={styles.feedbackContainer}>
                    <CustomButton variant="primary" size="md" onPress={() => onNext(isCorrectAnswer, selectedAnswerId)}>
                        {isLastQuestion ? "Finish" : "Next question >>>"}
                    </CustomButton>
                </View>
            ) : (
                <View style={styles.cardContainer}>
                    <Animated.View style={[styles.card, getCardStyle()]} {...panResponder.panHandlers}>
                        <Text style={styles.trueFalseText}>Unsafe or Safe?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => forceSwipe('left')}><Text
                                style={styles.thumbStyle}>👎</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => forceSwipe('right')}><Text
                                style={styles.thumbStyle}>👍</Text></TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, alignItems: 'center', backgroundColor: colors?.primary || '#FFDFAD'},
    card: {
        width: 300,
        height: 400,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pipContainer: {alignItems: 'flex-end', alignSelf: 'stretch', marginHorizontal: 15, marginTop: 40},
    pipImage: {width: 100, height: 100},
    trueFalseText: {fontSize: 24, fontWeight: 'bold'},
    buttonContainer: {flexDirection: 'row', justifyContent: 'space-between', width: 120},
    thumbStyle: {fontSize: 40},
    feedbackContainer: {height: 420, justifyContent: 'center'},
    cardContainer: {height: 420, justifyContent: 'center'}
});