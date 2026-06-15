import { StyleSheet, View } from "react-native";
import { Card } from "../../../components/Card";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function ModulesListItem({ module }) {
    const navigation = useNavigation();
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            <Card
                iconName="eye"
                lessonTitle={module.title}
                description={module.description}
                buttonText={t.ui.showLessons}
                onPress={() => navigation.navigate("LessonsList", {
                    moduleId: module.id,
                    moduleTitle: module.title
                })}
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
