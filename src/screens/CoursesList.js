import {useEffect, useState} from "react";
import {FlatList, View, StyleSheet} from "react-native";
import CoursesListItem from "./CoursesListItem.js";

export default function CoursesList() {

    const url = "http://145.24.223.106:8000/api/courses"
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getCourses()
    }, [])

    async function getCourses() {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    // "x-delay-ms": "2000"
                }
            })

            const data = await response.json()
            setCourses(data);


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                //gives styling to the content of the list
                columnWrapperStyle={styles.columnWrapper}
                //gives styling to the space in between the items of the list
                renderItem={({item}) =>
                    (<View>
                        <CoursesListItem course={item}/>
                    </View>)

                }
            />
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
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
});