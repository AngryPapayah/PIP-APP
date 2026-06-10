import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {colors} from "../../../styles/GlobalStyles";
import {fetchAPI} from "../../../services/Fetch";
import ModulesListItem from "./ModulesListItem";
import {useFilter} from "../../../contexts/FilterContext";

export default function ModulesList() {

    const navigation = useNavigation();

    const [modules, setModules] = useState([]);
    const [filteredModules, setFilteredModules] = useState([])
    const [loading, setLoading] = useState(true)

    //use context for filter
    const {selectedTitle} = useFilter()

    useEffect(() => {
        getModules()
    }, [])

    async function getModules() {

        setLoading(true)

        try {
            const data = await fetchAPI(`courses/1/modules`, 'GET')

            if (data && data.error) {
                console.error("API Error:", data.error);
                setLoading(false);
                navigation.goBack();
                return;
            }

            setModules(data);
            setLoading(false)


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    //filters the titles
    useEffect(() => {
        const allModules = Object.values(modules)

        if (selectedTitle) {
            const result = allModules.filter(module => module.title === selectedTitle)
            setFilteredModules(result)
        } else {
            setFilteredModules(allModules)
        }
    }, [selectedTitle, modules])

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
            {filteredModules.length === 0 ? (
                <View>
                    <Text>No modules found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredModules}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    //gives styling to the content of the list
                    renderItem={({item}) =>
                        (<View style={styles.itemWrapper}>
                            <ModulesListItem module={item}/>
                        </View>)

                    }
                />
            )}


        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
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