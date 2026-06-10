import {StyleSheet, View} from "react-native";
import {Card} from "../../../components/Card";
import {useNavigation} from "@react-navigation/native";

export default function ModulesListItem({module}) {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Card iconName="eye" lessonTitle={module.title} description={module.description}
                  buttonText={"Show Lessons"}
                  onPress={() => navigation.navigate("Lessons", {
                      moduleId: module.id,
                      moduleTitle: module.title
                  })}></Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
});