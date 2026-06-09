import {useEffect, useState} from "react";
import {FlatList, View, StyleSheet, Text} from "react-native";
import CoursesListItem from "./CoursesListItem.js";
import {fetchAPI} from "../../services/Fetch";
import {useFilter} from "../../contexts/FilterContext";

export default function CoursesList() {

    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([])
    const [loading, setLoading] = useState(true)

    //use context for filter
    const {selectedTitle} = useFilter()

    useEffect(() => {
        getCourses()
    }, [])

    async function getCourses() {
        setLoading(true)
        try {

            const data = await fetchAPI("courses", 'GET')

            if (data && data.error) {
                console.error("API Error:", data.error);
                setLoading(false);
                return;
            }

            setCourses(data);
            setFilteredCourses(data)
            setLoading(false)


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    //filters the titles
    useEffect(() => {
        const allCourses = Object.values(courses)

        if (selectedTitle) {
            const result = allCourses.filter(course => course.title === selectedTitle)
            setFilteredCourses(result)
        } else {
            setFilteredCourses(allCourses)
        }
    }, [selectedTitle, courses])


    //temporary loading screen
    if (loading) {
        return (
            <View>
                <Text>Courses are loading...</Text>
            </View>
        )
    }

    return (

        <View style={styles.container}>
            {filteredCourses.length === 0 ? (
                <View>
                    <Text>No courses found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredCourses}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    //gives styling to the content of the list
                    renderItem={({item}) =>
                        (<View style={styles.itemWrapper}>
                            <CoursesListItem course={item}/>
                        </View>)

                    }
                />
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        padding: 20,
    },
    itemWrapper: {
        marginBottom: 20
    }
});