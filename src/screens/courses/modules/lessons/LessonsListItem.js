import { StyleSheet, View } from "react-native";
import { Card } from "../../../../components/Card";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { fetchAPI } from "../../../../services/Fetch";
import { useAuth } from "../../../../contexts/AuthContext";
import { useLanguage } from "../../../../contexts/LanguageContext";

export default function LessonsListItem({ lesson, moduleId }) {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [isPassed, setIsPassed] = useState(false);

    useEffect(() => {
        if (lesson?.id && user?.id) {
            checkProgress();
        }
    }, [lesson?.id, user?.id]);

    async function checkProgress() {
        try {
            const response = await fetchAPI(
                `progress/lessons/${lesson.id}/attempts/${user.id}`,
                "GET"
            );

            const hasPassedAttempt = response?.attempts?.some(
                attempt => attempt.passed === true
            );

            setIsPassed(hasPassedAttempt);
        } catch (error) {
            console.error("An error occurred while checking progress:", error);
        }
    }

    return (
        <View style={styles.container}>
            <Card
                iconName={isPassed ? "checkmark-circle" : "eye"}
                lessonTitle={lesson.title}
                estimated_time={`Estimated minutes: ${lesson.estimated_minutes}`}
                description={lesson.description}
                buttonText={t.ui.startLesson}
                onPress={() => navigation.navigate("QuestionsScreen", { moduleId, lessonId: lesson.id })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
});