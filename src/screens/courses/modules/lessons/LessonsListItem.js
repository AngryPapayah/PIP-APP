import {StyleSheet, View} from "react-native";
import {Card} from "../../../../components/Card";
import {useNavigation} from "@react-navigation/native";

export default function LessonsListItem({lesson, moduleId}) {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Card iconName="eye" lessonTitle={lesson.title}
                  estimated_time={`Estimated minutes: ${lesson.estimated_minutes}`}
                  description={lesson.description} buttonText={"Start lesson"}
                  onPress={() => navigation.navigate("Questions", {moduleId, lessonId: lesson.id})}></Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
});
