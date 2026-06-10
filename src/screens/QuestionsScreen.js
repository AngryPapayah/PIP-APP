import MultipleChoice from "../components/MultipleChoice";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, Text} from "react-native";
import {colors} from "../styles/GlobalStyles";
import SwipeCard from "../components/SwipeCard";
import {fetchAPI} from "../services/Fetch";
import ProgressBar from "../components/ProgressBar";
import {useAuth} from "../contexts/AuthContext";

export default function QuestionsScreen() {

    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useAuth(); // Get user from AuthContext
    const {moduleId, lessonId} = route.params;

    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    // Use the user's ID from the context
    const userId = user?.id;


    useEffect(() => {
        // Make sure we have a userId before fetching questions
        if (userId) {
            getQuestions()
        }
    }, [moduleId, lessonId, userId])

    async function getQuestions() {
        setLoading(true)
        try {

            //start the lesson and save the attempt id
            const startData = await fetchAPI(`progress/lessons/${lessonId}/start`, 'POST', {userId: userId})

            if (startData && startData.error) {
                console.error("API Error:", startData.error);
                setLoading(false);
                return;
            }

            setAttemptId(startData.id)

            //get the questions from the lesson
            const questionData = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions`, 'GET')

            if (questionData && questionData.error) {
                console.error("API Error:", questionData.error);
                setLoading(false);
                return;
            }


            //get per question the belonging answers
            const fullQuestions = await Promise.all(
                questionData.map(async (question) => {

                    const answerData = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions/${question.id}`, 'GET')

                    if (answerData && answerData.error) {
                        console.error("API Error:", answerData.error);
                        setLoading(false);
                        return;
                    }

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
        const isLast = currentIndex >= questions.length - 1;

        if (isLast) {
            try {
                // Attempt to complete the lesson, but don't let it block navigation.
                await fetchAPI(`progress/attempts/${attemptId}/complete`, 'POST', {userId: userId});
            } catch (error) {
                console.error("Er is een fout opgetreden bij het voltooien van de les:", error);
            } finally {
                // Always navigate to the result screen.
                navigation.navigate("ResultScreen");
            }
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    }
    
    // Show a message if the user is not logged in
    if (!userId) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Please log in to view questions.</Text>
            </SafeAreaView>
        )
    }

    //temporary loading screen
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Questions are loading...</Text>
            </SafeAreaView>
        )
    }

    //fallback if api list is empty
    if (questions.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>No questions found for this lesson</Text>
            </SafeAreaView>
        )
    }

    //select active question based on the current index
    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <SafeAreaView style={styles.container}>
            {/*progress visualisation*/}
            <ProgressBar currentStep={currentIndex + 1} totalSteps={questions.length}/>

            {/*rendering component based on question type*/}
            {currentQuestion?.question_type === "multiple_choice" ? (
                <MultipleChoice question={currentQuestion} attemptId={attemptId} onNext={handleNext} isLastQuestion={isLastQuestion}></MultipleChoice>
            ) : (
                <SwipeCard question={currentQuestion} attemptId={attemptId} onNext={handleNext} isLastQuestion={isLastQuestion}></SwipeCard>
            )}
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: colors?.primary || '#FFDFAD',
    }
});