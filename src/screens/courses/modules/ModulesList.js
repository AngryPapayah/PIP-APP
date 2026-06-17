import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, View, Alert} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {colors} from "../../../styles/GlobalStyles";
import {fetchAPI} from "../../../services/Fetch";
import ModulesListItem from "./ModulesListItem";
import {useFilter} from "../../../contexts/FilterContext";
import {useLoading} from "../../../contexts/LoadingContext";
import {useLanguage} from "../../../contexts/LanguageContext";

export default function ModulesList() {
    const navigation = useNavigation();
    const [modules, setModules] = useState([]);
    const [filteredModules, setFilteredModules] = useState([]);

    const {setLoading} = useLoading();
    const {selectedTitle} = useFilter();
    const {t} = useLanguage();

    useEffect(() => {
        getModules();
    }, []);

    async function getModules() {
        setLoading(true);
        try {
            const data = await fetchAPI(`courses/1/modules`, 'GET');

            if (data && data.error) {
                Alert.alert(t.ui.error, t.errors.fetchModules);
                navigation.goBack();
                return;
            }

            setModules(data);
        } catch (error) {
            Alert.alert(t.ui.error, t.errors.generic);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const allModules = Object.values(modules);

        if (selectedTitle) {
            setFilteredModules(allModules.filter(module => module.title === selectedTitle));
        } else {
            setFilteredModules(allModules);
        }
    }, [selectedTitle, modules]);

    return (
        <View style={styles.container}>
            {filteredModules.length === 0 ? (
                <View>
                    <Text>{t.errors.noModules}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredModules}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({item}) => (
                        <View style={styles.itemWrapper}>
                            <ModulesListItem module={item}/>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: colors?.primary || '#F4E1C1',
    },
    listContainer: {
        padding: 20,
    },
    itemWrapper: {
        marginBottom: 20
    }
});