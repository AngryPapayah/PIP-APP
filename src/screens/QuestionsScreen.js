import MultipleChoice from "../components/MultipleChoice";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, Text, Alert, View, ScrollView} from "react-native";
import {colors} from "../styles/GlobalStyles";
import SwipeCard from "../components/SwipeCard";
import {fetchAPI} from "../services/Fetch";
import ProgressBar from "../components/ProgressBar";
import {useAuth} from "../contexts/AuthContext";
import {useLoading} from "../contexts/LoadingContext";
import {useLanguage} from "../contexts/LanguageContext";

export default function QuestionsScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const {user, refreshUser} = useAuth();
    const {setLoading} = useLoading();
    const {t} = useLanguage();
    const {moduleId, lessonId} = route.params;

    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localScore, setLocalScore] = useState(0);

    const userId = user?.id;

    useEffect(() => {
        if (userId) getQuestions();
    }, [moduleId, lessonId, userId]);

    async function getQuestions() {
        setLoading(true);
        try {
            const startData = await fetchAPI(`progress/lessons/${lessonId}/start`, 'POST', {userId});
            if (startData && startData.error) {
                Alert.alert(t.ui.error, startData.error);
                return;
            }
            const aid = startData?.attemptId || startData?.data?.attemptId;
            setAttemptId(aid);

            const questionData = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions`, 'GET');
            if (questionData && questionData.error) {
                Alert.alert(t.ui.error, questionData.error);
                return;
            }

            const actualQuestions = Array.isArray(questionData) ? questionData : (questionData?.data || []);

            if (actualQuestions.length > 0) {
                const fullQuestions = await Promise.all(
                    actualQuestions.map(async (question) => {
                        const answerData = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions/${question.id}`, 'GET');

                        let extractedAnswers = [];
                        const rawAnswers = answerData?.answers || answerData?.data?.answers || answerData?.data || answerData;

                        if (Array.isArray(rawAnswers)) {
                            extractedAnswers = rawAnswers;
                        }

                        return {...question, answers: extractedAnswers};
                    })
                );
                setQuestions(fullQuestions.sort(() => Math.random() - 0.5));
            } else {
                Alert.alert(t.ui.error, t.errors.noQuestions);
            }
        } catch (error) {
            Alert.alert(t.ui.error, t.errors.generic);
        } finally {
            setLoading(false);
        }
    }

    async function handleNext(isCorrect, selectedAnswerId) {
        const currentQuestion = questions[currentIndex];
        if (!attemptId || !currentQuestion) {
            Alert.alert(t.ui.error, "Data ontbreekt.");
            return;
        }

        setLoading(true);
        try {
            await fetchAPI(`progress/attempts/${attemptId}/answers`, 'POST', {
                questionId: currentQuestion.id,
                answerId: selectedAnswerId
            });

            let currentScore = localScore;
            if (isCorrect) {
                currentScore = localScore + 10;
                setLocalScore(prevScore => prevScore + 10);
            }

            const isLast = currentIndex >= questions.length - 1;

            if (isLast) {
                const completeRes = await fetchAPI(`progress/attempts/${attemptId}/complete`, 'POST', {userId});
                const finalScore = completeRes?.score || currentScore;

                await fetchAPI('progress/xp', 'POST', {
                    userId,
                    activityType: 'quiz_completed',
                    activityId: `lesson_${lessonId}`,
                    xpAmount: finalScore
                });

                await refreshUser();

                navigation.navigate("ResultScreen", {attemptId, lessonId, score: finalScore});
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        } catch (error) {
            if (currentIndex >= questions.length - 1) {
                await refreshUser();
                navigation.navigate("ResultScreen", {score: localScore});
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        } finally {
            setLoading(false);
        }
    }

    if (!userId) return <View style={styles.container}><Text>{t.errors.loginRequired}</Text></View>;
    if (questions.length === 0 && !attemptId) return null;
    if (questions.length === 0) return <View style={styles.container}><Text>{t.errors.noQuestions}</Text></View>;

    const currentQuestion = questions[currentIndex];

    return (
        <SafeAreaView style={styles.safeAreaView}>

            <ScrollView contentContainerStyle={styles.container}>

                <ProgressBar currentStep={currentIndex + 1} totalSteps={questions.length}/>
                {currentQuestion?.question_type?.toLowerCase() === "multiple_choice" ? (
                    <MultipleChoice
                        question={currentQuestion}
                        onNext={handleNext}
                        isLastQuestion={currentIndex === questions.length - 1}
                    />
                ) : (
                    <SwipeCard
                        question={currentQuestion}
                        onNext={handleNext}
                        isLastQuestion={currentIndex === questions.length - 1}
                    />
                )}
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexGrow: 1,
        backgroundColor: colors?.primary || '#FFDFAD'
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: colors?.primary || '#F4E1C1',
    },
});