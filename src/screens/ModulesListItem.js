import {StyleSheet, View} from "react-native";
import {Card} from "../components/Card";

export default function ModulesListItem({module}) {
    return (
        <View style={styles.container}>
            <Card iconName="eye" lessonTitle={module.title} description={module.description}
                  buttonText={"Start Module"}></Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
});