import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../../../../styles/GlobalStyles";
import LessonsListItem from "./LessonsListItem";
import {fetchAPI} from "../../../../services/Fetch";

export default function LessonsList() {

    const route = useRoute();
    const navigation = useNavigation();
    const {moduleId, moduleTitle} = route.params;

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getLessons()
    }, [moduleId])

    async function getLessons() {
        setLoading(true)
        try {

            const data = await fetchAPI(`courses/1/modules/${moduleId}/lessons`, 'GET')

            if (data && data.error) {
                console.error("API Error:", data.error);
                setLoading(false);
                return;
            }

            const filteredLessons = data.filter(lesson => Number(lesson.module_id) === Number(moduleId));

            setLessons(filteredLessons);
            setLoading(false)


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    //temporary loading screen
    if (loading) {
        return (
            <View>
                <Text>Lessons are loading...</Text>
            </View>
        )
    }

    return (

        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={25} color={colors?.textMain || "#000"}></Ionicons>
                </TouchableOpacity>
                <Text style={styles.text}>Your lessons from module {moduleTitle}</Text>
            </View>
            <FlatList
                data={lessons}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                //gives styling to the content of the list
                renderItem={({item}) =>
                    (<View style={styles.itemWrapper}>
                        <LessonsListItem lesson={item} moduleId={moduleId}/>
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
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
    },
    backButton: {
        padding: 10,
    },
});