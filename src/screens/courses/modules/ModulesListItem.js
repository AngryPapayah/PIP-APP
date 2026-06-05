import {StyleSheet, View} from "react-native";
import {Card} from "../../../components/Card";
import {useNavigation} from "@react-navigation/native";

export default function ModulesListItem({module, courseId}) {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Card iconName="eye" lessonTitle={module.title} description={module.description}
                  buttonText={"Show Lessons"}
                  onPress={() => navigation.navigate("Lessons", {courseId, moduleId: module.id})}></Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
});