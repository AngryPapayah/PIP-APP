import MultipleChoice from "../components/MultipleChoice";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {colors} from "../styles/GlobalStyles";
import {fetchAPI} from "../services/Fetch";

export default function QuestionsScreen() {

    const route = useRoute();
    const navigation = useNavigation();
    const {courseId, moduleId, lessonId} = route.params;

    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    //temporary user id
    const userId = 1;


    useEffect(() => {
        getQuestions()
    }, [courseId, moduleId, lessonId])

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
            const questionData = await fetchAPI(`courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions`, 'GET')

            if (questionData && questionData.error) {
                console.error("API Error:", questionData.error);
                setLoading(false);
                return;
            }


            //get per question the belonging answers
            const fullQuestions = await Promise.all(
                questionData.map(async (question) => {

                    const answerData = await fetchAPI(`courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${question.id}`, 'GET')

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

            setQuestions(fullQuestions)
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
        } else {
            try {
                //complete the lesson
                const completeData = await fetchAPI(`progress/attempts/${attemptId}/complete`, 'POST', {userId: userId})

                if (completeData && completeData.error) {
                    console.error("API Error:", completeData.error);
                    setLoading(false);
                    return;
                }

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
            <View>
                <Text>Questions are loading...</Text>
            </View>
        )
    }

    //fallback if api list is empty
    if (questions.length === 0) {
        return (
            <View>
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
                <Text>here swipe component</Text>
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