import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View, Alert} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../../../../styles/GlobalStyles";
import LessonsListItem from "./LessonsListItem";
import {fetchAPI} from "../../../../services/Fetch";
import {useLoading} from "../../../../contexts/LoadingContext";
import {useLanguage} from "../../../../contexts/LanguageContext";

export default function LessonsList() {
    const route = useRoute();
    const navigation = useNavigation();
    const {moduleId, moduleTitle} = route.params;
    const {setLoading} = useLoading();
    const {t} = useLanguage();

    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        getLessons();
    }, [moduleId]);

    async function getLessons() {
        setLoading(true);
        try {
            const data = await fetchAPI(`courses/1/modules/${moduleId}/lessons`, 'GET');

            if (data && data.error) {
                Alert.alert(t.ui.error, t.errors.startled);
                return;
            }

            const filteredLessons = data.filter(lesson => Number(lesson.module_id) === Number(moduleId));
            setLessons(filteredLessons);
        } catch (error) {
            console.error("An error occurred while fetching lessons:", error);
            Alert.alert(t.ui.error, t.errors.generic);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={25} color={colors?.textMain || "#000"}/>
                </TouchableOpacity>
                <Text style={styles.text}>{t.ui.lessonsFrom} {moduleTitle}</Text>
            </View>
            <FlatList
                style={{flex: 1}}
                data={lessons}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={({item}) => (
                    <View style={styles.itemWrapper}>
                        <LessonsListItem lesson={item} moduleId={moduleId}/>
                    </View>
                )}
            />
        </View>
    );
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
        paddingBottom: 50
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