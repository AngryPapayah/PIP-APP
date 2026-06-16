import MultipleChoice from "../components/MultipleChoice";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
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
    const { user, updateUser } = useAuth();
    const { setLoading } = useLoading();
    const { t } = useLanguage();
    const { moduleId, lessonId } = route.params;

    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    const userId = user?.id;

    const getXPFromUser = (userObj) => {
        return Number(userObj?.xp ?? userObj?.experience ?? userObj?.experience_points ?? 0);
    };

    const getQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const startData = await fetchAPI(`progress/lessons/${lessonId}/start`, 'POST', { userId });
            if (startData?.error) {
                Alert.alert(t.ui.error, startData.error);
                return;
            }
            setAttemptId(startData.attemptId);

            const questionData = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions`, 'GET');
            if (questionData?.error) {
                Alert.alert(t.ui.error, questionData.error);
                return;
            }

            const fullQuestions = await Promise.all(
                questionData.map(async (q) => {
                    const answers = await fetchAPI(`courses/1/modules/${moduleId}/lessons/${lessonId}/questions/${q.id}`, 'GET');
                    return { ...q, answers: answers.answers };
                })
            );
            setQuestions(fullQuestions.sort(() => Math.random() - 0.5));
        } catch (error) {
            Alert.alert(t.ui.error, t.errors.generic);
        } finally {
            setLoading(false);
        }
    }, [userId, lessonId, moduleId, setLoading, t]);

    useEffect(() => {
        if (userId) getQuestions();
    }, [getQuestions, userId]);

    async function handleNext(isCorrect) {
        const newScore = score + (isCorrect ? 10 : 0);
        const isLast = currentIndex >= questions.length - 1;

        if (isLast) {
            setLoading(true);
            try {
                await fetchAPI(`progress/attempts/${attemptId}/complete`, 'POST', { userId });
                const res = await fetchAPI(`users/${userId}/progress/lesson/${lessonId}`, 'PUT');

                if (res && !res.error) {
                    updateUser({
                        xp: res.newXp,
                        experience: res.newXp,
                        experience_points: res.newXp,
                        level: res.newLevel,
                        current_level_id: res.newLevel
                    });
                } else {
                    const xpRes = await fetchAPI('progress/xp', 'POST', {
                        userId,
                        activityType: 'quiz_completed',
                        activityId: `lesson_${lessonId}`,
                        xpAmount: 20
                    });

                    if (xpRes && !xpRes.error) {
                        const updatedXP = getXPFromUser(user) + 20;
                        updateUser({ xp: updatedXP, experience: updatedXP, experience_points: updatedXP });
                    }
                }

                navigation.navigate("ResultScreen", { score: newScore });
            } catch (error) {
                Alert.alert(t.ui.error, t.errors.finishError);
            } finally {
                setLoading(false);
            }
        } else {
            if (isCorrect) setScore(newScore);
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
    );
}

const styles = StyleSheet.create({ container: { padding: 10, flex: 1, backgroundColor: colors?.primary || '#FFDFAD' } });