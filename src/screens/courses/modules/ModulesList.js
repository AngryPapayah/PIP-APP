import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ModulesListItem from "./ModulesListItem";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../../../styles/GlobalStyles";

export default function ModulesList() {

    const route = useRoute();
    const navigation = useNavigation();
    const {courseId} = route.params;

    const url = `http://145.24.223.106:8000/api/courses/${courseId}/modules`
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getModules()
    }, [courseId])

    async function getModules() {

        setLoading(true)

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            })

            const data = await response.json()
            setModules(data);
            setLoading(false)


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    //temporary loading screen
    if (loading) {
        return (
            <View>
                <Text>Modules are loading...</Text>
            </View>
        )
    }

    return (

        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={25} color={colors?.textMain || "#000"}></Ionicons>
                </TouchableOpacity>
                <Text style={styles.text}>Your Modules about {modules[0]?.course_name}</Text>
            </View>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                //gives styling to the content of the list
                renderItem={({item}) =>
                    (<View style={styles.itemWrapper}>
                        <ModulesListItem module={item} courseId={courseId}/>
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
        backgroundColor: colors?.primary || '#fff',
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