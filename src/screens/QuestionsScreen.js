import MultipleChoice from "../components/MultipleChoice";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, Alert } from "react-native";
import { colors } from "../styles/GlobalStyles";
import SwipeCard from "../components/SwipeCard";
import { fetchAPI } from "../services/Fetch";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../contexts/AuthContext";
import { useLoading } from "../contexts/LoadingContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function QuestionsScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useAuth();
    const { setLoading } = useLoading();
    const { t } = useLanguage();
    const { moduleId, lessonId } = route.params;

    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0);

    const userId = user?.id;

    useEffect(() => {
        if (userId) getQuestions();
    }, [moduleId, lessonId, userId])

    async function getQuestions() {
        setLoading(true)
        try {
            const startData = await fetchAPI(`progress/lessons/${lessonId}/start`, 'POST', { userId: userId })
            if (startData && startData.error) {
                Alert.alert(t.ui.error, startData.error);
                return;
            }
            setAttemptId(startData.attemptId)

            const questionData = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions`, 'GET')
            if (questionData && questionData.error) {
                Alert.alert(t.ui.error, questionData.error);
                return;
            }

            const fullQuestions = await Promise.all(
                questionData.map(async (question) => {
                    const answerData = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions/${question.id}`, 'GET')
                    return { ...question, answers: answerData.answers }
                })
            )
            setQuestions(fullQuestions.sort(() => Math.random() - 0.5))
        } catch (error) {
            Alert.alert(t.ui.error, t.errors.generic);
        } finally {
            setLoading(false)
        }
    }

    async function handleNext(isCorrect) {
        const newScore = score + (isCorrect ? 10 : 0);
        if (isCorrect) {
            setScore(newScore);
        }

        if (isCorrect) setScore(prevScore => prevScore + 10);
        const isLast = currentIndex >= questions.length - 1;

        if (isLast) {
            setLoading(true);
            try {
                // Les afronden
                await fetchAPI(
                    `progress/attempts/${attemptId}/complete`,
                    'POST',
                    {
                        userId: userId
                    }
                );
                console.log("Lesson completed");

                // XP
                const xpResponse = await fetchAPI(
                    'progress/xp',
                    'POST',
                    {
                        userId: userId,
                        activityType: 'quiz_completed',
                        activityId: `lesson_${lessonId}`,
                        xpAmount: newScore
                    }
                );
                console.log("XP RESPONSE:", xpResponse);

                // Controle
                const updatedUser = await fetchAPI(
                    `users/${userId}`,
                    'GET'
                );
                console.log("UPDATED USER:", updatedUser);

                await fetchAPI(`progress/attempts/${attemptId}/complete`, 'POST', { userId: userId });
                navigation.navigate("ResultScreen", { attemptId, lessonId, score: score + (isCorrect ? 10 : 0) });
            } catch (error) {
                console.error(
                    "Er is een fout opgetreden bij het voltooien van de les:",
                    error
                );
                Alert.alert(t.ui.error, t.errors.finishError);
            } finally {
                navigation.navigate("ResultScreen", {
                    score: newScore
                });
                setLoading(false);
            }
        } else {
            if (isCorrect) {
                setScore(newScore);
            }
            setCurrentIndex(currentIndex + 1);
        }
    }

    if (!userId) return <SafeAreaView style={styles.container}><Text>{t.errors.loginRequired}</Text></SafeAreaView>;
    if (questions.length === 0 && !currentIndex) return null;
    if (questions.length === 0) return <SafeAreaView style={styles.container}><Text>{t.errors.noQuestions}</Text></SafeAreaView>;

    const currentQuestion = questions[currentIndex];

    return (
        <SafeAreaView style={styles.container}>
            <ProgressBar currentStep={currentIndex + 1} totalSteps={questions.length} />
            {currentQuestion?.question_type === "multiple_choice" ? (
                <MultipleChoice question={currentQuestion} attemptId={attemptId} onNext={handleNext} isLastQuestion={currentIndex === questions.length - 1} />
            ) : (
                <SwipeCard question={currentQuestion} attemptId={attemptId} onNext={handleNext} isLastQuestion={currentIndex === questions.length - 1} />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({ container: { padding: 10, flex: 1, backgroundColor: colors?.primary || '#FFDFAD' } });