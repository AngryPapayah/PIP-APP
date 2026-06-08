import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../../../../styles/GlobalStyles";
import LessonsListItem from "./LessonsListItem";

export default function LessonsList() {

    const route = useRoute();
    const navigation = useNavigation();
    const {courseId, moduleId} = route.params;

    const url = `http://145.24.223.106:8000/api/courses/${courseId}/modules/${moduleId}/lessons`
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        getLessons()
    }, [courseId, moduleId])

    async function getLessons() {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            })

            const data = await response.json()
            setLessons(data);


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }


    return (

        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={25} color={colors?.textMain || "#000"}></Ionicons>
                </TouchableOpacity>
                <Text style={styles.text}>Your lessons from module {lessons[0]?.module_title}</Text>
            </View>
            <FlatList
                data={lessons}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                //gives styling to the content of the list
                renderItem={({item}) =>
                    (<View style={styles.itemWrapper}>
                        <LessonsListItem lesson={item} courseId={courseId} moduleId={moduleId}/>
                    </View>)

                }
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: colors?.primary || '#FFDFAD',
    },
    headerContainer: {
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"

    },
    listContainer: {
        padding: 20,
    },
    itemWrapper: {
        marginBottom: 20
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    backButton: {
        padding: 10,
    },
});