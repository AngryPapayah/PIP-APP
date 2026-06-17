import {CustomButton} from "./CustomButton";
import {ScrollView, StyleSheet, View, Image} from "react-native";
import {colors} from "../styles/GlobalStyles";
import React, {useEffect, useState} from "react";
import TextBubble from "./TextBubble";

export default function MultipleChoice({question, onNext, isLastQuestion}) {
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

    useEffect(() => {
        setSelectedAnswerId(null);
        setHasAnswered(false);
        setIsCorrectAnswer(false);
    }, [question?.id]);

    function handleAnswer(answer) {
        if (hasAnswered) return;

        setSelectedAnswerId(answer.id);
        setHasAnswered(true);

        if (answer.is_correct === 1 || answer.is_correct === true) {
            setIsCorrectAnswer(true);
        } else {
            setIsCorrectAnswer(false);
        }
    }

    let pipImage = require('../../public/images/pip-body.png');

    if (hasAnswered) {
        if (isCorrectAnswer) {
            pipImage = require('../../public/images/pip-good.png');
        } else {
            pipImage = require('../../public/images/pip-bad.png');
        }
    }

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
            {hasAnswered ? (
                <View style={styles.container}>
                    {question?.explanation && (
                        <TextBubble text={question?.explanation}></TextBubble>
                    )}
                    <Image source={pipImage} style={styles.imageStyle} resizeMode="contain" />
                    <View>
                        <CustomButton
                            variant="primary"
                            size="sm"
                            onPress={() => onNext(isCorrectAnswer, selectedAnswerId)}>
                            {isLastQuestion ? "Finish" : "Next question >>>"}
                        </CustomButton>
                    </View>
                </View>
            ) : (
                <View style={styles.container}>
                    <TextBubble text={question?.question_text || "Loading Question..."}></TextBubble>
                    <Image source={pipImage} style={styles.imageStyle} resizeMode="contain" />
                </View>
            )}
            <View style={styles.answersContainer}>
                {question?.answers?.map((answer) => {
                    let currentVariant = "questionButton";
                    if (hasAnswered) {
                        if (answer.is_correct === 1 || answer.is_correct === true) {
                            currentVariant = "rightAnswer";
                        } else if (answer.id === selectedAnswerId) {
                            currentVariant = "wrongAnswer";
                        }
                    }
                    return (
                        <CustomButton
                            key={answer.id}
                            variant={currentVariant}
                            size="sm"
                            onPress={() => handleAnswer(answer)}
                            disabled={hasAnswered}
                        >{answer.answer_text}</CustomButton>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: { padding: 20, backgroundColor: colors?.primary || '#FFDFAD', alignItems: 'center' },
    scrollContainer: { padding: 5, backgroundColor: colors?.primary || '#FFDFAD', alignItems: 'center', paddingBottom: 50, flexGrow: 1 },
    answersContainer: { width: "100%" },
    imageStyle: { width: 200, height: 200, marginLeft: 15 }
});