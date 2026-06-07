import {CustomButton} from "./CustomButton";
import {ScrollView, StyleSheet, View, Text} from "react-native";
import {colors} from "../styles/GlobalStyles";
import React, {useEffect, useState} from "react";

export default function MultipleChoice({question, attemptId, onNext}) {

    const [selectedAnswerId, setSelectedAnswerId] = useState(null)
    const [hasAnswered, setHasAnswered] = useState(false)

    //reset status once new question loads
    useEffect(() => {
        setSelectedAnswerId(null)
        setHasAnswered(false)
    }, [question.id]);

    async function handleAnswer(answerId) {
        //prevent user from clicking an answer again
        if (hasAnswered) return;

        setSelectedAnswerId(answerId)
        setHasAnswered(true)

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
                    answerId: answerId
                })
            })

        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    return (
        <ScrollView style={styles.container}>

            {/*show question*/}
            <Text>
                {question?.question_text || question?.title || "Loading Question..."}
            </Text>

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
                            onPress={() => handleAnswer(answer.id)}
                        >{answer.answer_text}</CustomButton>
                    )
                })}
            </View>

            {hasAnswered && (
                <View>
                    {question?.explanation && (
                        <View>
                            <Text>Explanation</Text>
                            <Text>{question.explanation}</Text>
                        </View>
                    )}

                    <CustomButton
                        variant="primary"
                        size="md"
                        onPress={onNext}>
                        Next question
                    </CustomButton>
                </View>
            )}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
    },
    answersContainer: {
        width: "100%",
    },
});
