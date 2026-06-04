import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import ModulesListItem from "./ModulesListItem";
import {useRoute} from "@react-navigation/native";
import {colors, globalStyles} from "../styles/GlobalStyles";

export default function ModulesList() {

    const route = useRoute();
    const {courseId} = route.params;

    const url = `http://145.24.223.106:8000/api/courses/${courseId}/modules`


    const [modules, setModules] = useState([]);

    useEffect(() => {
        getModules()
    }, [courseId])

    async function getModules() {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            })

            const data = await response.json()
            setModules(data);


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }


    return (

        <View style={styles.container}>
            <Text style={globalStyles?.text || styles.text}>Your Modules</Text>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                //gives styling to the content of the list
                renderItem={({item}) =>
                    (<View style={styles.itemWrapper}>
                        <ModulesListItem module={item}/>
                    </View>)

                }
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
    },
    listContainer: {
        padding: 20,
    },
    itemWrapper: {
        marginBottom: 20
    }
});