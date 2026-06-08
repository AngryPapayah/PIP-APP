import MultipleChoice from "../components/MultipleChoice";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {colors} from "../styles/GlobalStyles";
import SwipeCard from "../components/SwipeCard";

export default function QuestionsScreen() {

    const route = useRoute();
    const navigation = useNavigation();
    const {courseId, moduleId, lessonId} = route.params;

    const questionUrl = `http://145.24.223.106:8000/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions`
    const startUrl = `http://145.24.223.106:8000/api/progress/lessons/${lessonId}/start`

    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        getQuestions()
    }, [courseId, moduleId, lessonId])

    async function getQuestions() {
        setLoading(true)
        try {

            //start the lesson and save the attempt id
            const startResponse = await fetch(startUrl, {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                }
            })
            const startData = await startResponse.json()
            setAttemptId(startData.id)

            //get the questions from the lesson
            const questionResponse = await fetch(questionUrl, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            })
            const questionData = await questionResponse.json()


            //get per question the belonging answers
            const fullQuestions = await Promise.all(
                questionData.map(async (question) => {
                    const answerUrl = `http://145.24.223.106:8000/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${question.id}`
                    const answerResponse = await fetch(answerUrl, {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                        }
                    })
                    const answerData = await answerResponse.json()
                    console.log("DIT GEEFT DE ANTWOORDEN API TERUG:", answerData);
                    //return the question and attach the associated answers array
                    return {...question, answers: answerData.answers}
                })
            )

            // Shuffle the questions array to randomize the order
            const shuffledQuestions = [...fullQuestions].sort(() => Math.random() - 0.5);

            setQuestions(shuffledQuestions)
            setLoading(false)


        } catch (error) {
            console.error("Er is een fout opgetreden", error);

        }
    }

    //to navigate to the next question or end the lesson
    async function handleNext() {
        setLoading(true)
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setLoading(false)
        } else {
            try {
                //complete the lesson
                const completeUrl = `http://145.24.223.106:8000/api/progress/attempts/${attemptId}/complete`
                const completeResponse = await fetch(completeUrl, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                    }
                })

                navigation.navigate("Modules")
                setLoading(false)

            } catch (error) {
                console.error("Er is een fout opgetreden", error);
            }
        }
    }

    //temporary loading screen
    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Questions are loading...</Text>
            </View>
        )
    }

    //fallback if api list is empty
    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No questions found for this lesson</Text>
            </View>
        )
    }

    //select active question based on the current index
    const currentQuestion = questions[currentIndex];

    return (<View style={styles.container}>

            {/*temporary progress visualisation*/}
            <Text style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</Text>

            {/*rendering component based on question type*/}
            {currentQuestion?.question_type === "multiple_choice" ? (
                <MultipleChoice question={currentQuestion} attemptId={attemptId} onNext={handleNext}></MultipleChoice>
            ) : (
                <SwipeCard question={currentQuestion} attemptId={attemptId} onNext={handleNext}></SwipeCard>
            )}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: colors?.primary || '#FFDFAD',
    },
    progressText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666'
    }
});