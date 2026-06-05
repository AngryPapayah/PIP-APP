import {StyleSheet, View} from "react-native";
import {Card} from "../../../../components/Card";

export default function LessonsListItem({lesson}) {

    return (
        <View style={styles.container}>
            <Card iconName="eye" lessonTitle={lesson.title}
                  estimated_time={`Estimated minutes: ${lesson.estimated_minutes}`}
                  description={lesson.description} buttonText={"Start lesson"}></Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
});
