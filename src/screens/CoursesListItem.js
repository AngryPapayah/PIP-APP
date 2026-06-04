import {StyleSheet, View} from "react-native";
import {Card} from "../components/Card";

export default function CoursesListItem({course}) {
    return (
        <View style={styles.container}>
            <Card iconName="eye" lessonTitle={course.title} description={course.description}
                  difficulty={course.difficulty_level} buttonText={"Show modules"}></Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
});
