import {useEffect, useState} from "react";
import {fetchAPI} from "../services/Fetch";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {DrawerContentScrollView} from "@react-navigation/drawer";
import {colors} from "../styles/GlobalStyles";
import {useFilter} from "../contexts/FilterContext";

export default function DrawerContent(props) {

    const [modules, setModules] = useState([])
    const [loading, setLoading] = useState(true)

    const {selectedTitle, setSelectedTitle} = useFilter()

    useEffect(() => {
        getDrawerModules()
    }, []);

    async function getDrawerModules() {
        setLoading(true)
        try {

            const data = await fetchAPI("courses/1/modules", 'GET')

            if (data && data.error) {
                console.error("API Error:", data.error);
                setLoading(false);
                return;
            }

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
        <DrawerContentScrollView {...props} style={{backgroundColor: colors.navbar}}>
            <View style={styles.container}>
                <Text style={styles.text}>Filter your Modules</Text>

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


                    {/*show modules and click to filter*/}
                    {modules.map((module) => {

                        const isActive = selectedTitle === module.title;

                        return (
                            <TouchableOpacity
                                key={module.id}
                                style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
                                onPress={() => {
                                    setSelectedTitle(module.title)
                                    props.navigation.closeDrawer();
                                }}>
                                <Text
                                    style={[styles.drawerText, isActive && styles.activeDrawerText]}> {module.title}</Text>
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