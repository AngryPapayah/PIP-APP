import {StyleSheet, View} from "react-native";
import {Card} from "../../components/Card";
import {useNavigation} from "@react-navigation/native";

export default function CoursesListItem({course}) {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Card iconName="eye" lessonTitle={course.title} description={course.description}
                  difficulty={course.difficulty_level} buttonText={"Show modules"}
                  onPress={() => navigation.navigate("Modules", {courseId: course.id})}></Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
});
