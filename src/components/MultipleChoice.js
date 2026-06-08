import {CustomButton} from "./CustomButton";
import {ScrollView, StyleSheet, View, Text, Image} from "react-native";
import {colors} from "../styles/GlobalStyles";
import React, {useEffect, useState} from "react";
import TextBubble from "./TextBubble";

export default function MultipleChoice({question, attemptId, onNext}) {

    const [selectedAnswerId, setSelectedAnswerId] = useState(null)
    const [hasAnswered, setHasAnswered] = useState(false)
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)

    //reset status once new question loads
    useEffect(() => {
        setSelectedAnswerId(null)
        setHasAnswered(false)
        setIsCorrectAnswer(false)
    }, [question?.id]);

    async function handleAnswer(answer) {
        //prevent user from clicking an answer again
        if (hasAnswered) return;

        setSelectedAnswerId(answer.id)
        setHasAnswered(true)


        if (answer.is_correct === 1 || answer.is_correct === true) {
            setIsCorrectAnswer(true)
        } else {
            setIsCorrectAnswer(false)
        }

        try {
            //send chosen answer to server so we can check
            const answerUrl = `http://145.24.223.106:8000/api/progress/attempts/${attemptId}/answers`
            await fetch(answerUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionId: question.id,
                    answerId: answer.id
                })
            })

        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    //changing pips image after answer is given
    let pipImage = require('../../public/images/pip-body.png')

    if (hasAnswered) {
        if (isCorrectAnswer) {
            pipImage = require('../../public/images/pip-good.png')
        } else {
            pipImage = require('../../public/images/pip-bad.png')
        }
    }

    return (
        <ScrollView style={styles.scrollContainer}>

            {/*show question or explanation*/}
            {hasAnswered ? (
                <View style={styles.container}>
                    {question?.explanation && (
                        <TextBubble text={question?.explanation}></TextBubble>
                    )}


                    <Image
                        source={pipImage}
                        style={{width: 200, height: 200, marginLeft: 15,}}
                        resizeMode="contain"
                    />

                    <View>
                        <CustomButton
                            variant="primary"
                            size="md"
                            onPress={onNext}>
                            Next question >>>
                        </CustomButton>
                    </View>
                </View>
            ) : (
                <View style={styles.container}>
                    <TextBubble text={question?.question_text || question?.title || "Loading Question..."}></TextBubble>
                    <Image
                        source={pipImage}
                        style={{width: 200, height: 200, marginLeft: 15,}}
                        resizeMode="contain"
                    />
                </View>
            )}


            <View style={styles.answersContainer}>
                {question?.answers?.map((answer) => {

                    let currentVariant = "primary"

                    // changing colors based on given answer
                    if (hasAnswered) {
                        if (answer.is_correct === 1 || answer.is_correct === true) {
                            currentVariant = "rightAnswer"
                        } else if (answer.id === selectedAnswerId) {
                            currentVariant = "wrongAnswer"
                        }
                    }

                    return (
                        <CustomButton
                            key={answer.id}
                            variant={currentVariant}
                            size="lg"
                            onPress={() => handleAnswer(answer)}
                        >{answer.answer_text}</CustomButton>
                    )
                })}
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: colors?.primary || '#FFDFAD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        padding: 5,
        flex: 1,
        backgroundColor: colors?.primary || '#FFDFAD',
    },
    answersContainer: {
        width: "100%",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
});
