import {useEffect, useState} from "react";
import {fetchAPI} from "../services/Fetch";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {DrawerContentScrollView} from "@react-navigation/drawer";
import {colors} from "../styles/GlobalStyles";
import {useFilter} from "../contexts/FilterContext";

export default function DrawerContent(props) {

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    const {selectedTitle, setSelectedTitle} = useFilter()

    useEffect(() => {
        getDrawerCourses()
    }, []);

    async function getDrawerCourses() {
        setLoading(true)
        try {

            const data = await fetchAPI("courses", 'GET')

            if (data && data.error) {
                console.error("API Error:", data.error);
                setLoading(false);
                return;
            }

            setCourses(data);
            setLoading(false)


        } catch (error) {
            console.error("Er is een fout opgetreden", error);
        }
    }

    //temporary loading screen
    if (loading) {
        return (
            <View>
                <Text>Courses are loading...</Text>
            </View>
        )
    }

    return (
        <DrawerContentScrollView {...props} style={{backgroundColor: colors.navbar}}>
            <View style={styles.container}>
                <Text style={styles.text}>Filter your courses</Text>

                <View>

                    {/*reset filters*/}
                    <TouchableOpacity
                        style={[styles.drawerItem, selectedTitle === null && styles.activeDrawerItem]}
                        onPress={() => {
                            setSelectedTitle(null)
                            props.navigation.closeDrawer();
                        }}
                    >
                        <Text style={[styles.drawerText, selectedTitle === null && styles.activeDrawerText]}>Reset
                            filters</Text>
                    </TouchableOpacity>


                    {/*show courses and click to filter*/}
                    {courses.map((course) => {

                        const isActive = selectedTitle === course.title;

                        return (
                            <TouchableOpacity
                                key={course.id}
                                style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
                                onPress={() => {
                                    setSelectedTitle(course.title)
                                    props.navigation.closeDrawer();
                                }}>
                                <Text
                                    style={[styles.drawerText, isActive && styles.activeDrawerText]}> {course.title}</Text>
                            </TouchableOpacity>
                        )


                    })}

                </View>

            </View>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    text: {
        color: colors?.textCard,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    drawerItem: {
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#FFFFFF33'
    },
    drawerText: {
        color: colors?.textCard,
        fontSize: 16
    },

    activeDrawerItem: {
        backgroundColor: '#0000004C',
        borderBottomWidth: 0,
    },
    activeDrawerText: {
        color: colors?.textCard,
        fontWeight: 'bold'
    }
});