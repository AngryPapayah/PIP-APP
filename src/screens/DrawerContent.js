import { useEffect, useState } from "react";
import { fetchAPI } from "../services/Fetch";
import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { colors } from "../styles/GlobalStyles";
import { useFilter } from "../contexts/FilterContext";
import { useLoading } from "../contexts/LoadingContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function DrawerContent(props) {
    const [modules, setModules] = useState([])
    const { setLoading } = useLoading();
    const { selectedTitle, setSelectedTitle } = useFilter()
    const { t } = useLanguage();

    useEffect(() => {
        getDrawerModules()
    }, []);

    async function getDrawerModules() {
        setLoading(true)
        try {
            const data = await fetchAPI("courses/1/modules", 'GET')
            if (data && data.error) {
                Alert.alert(t.ui.error, data.error);
                return;
            }
            setModules(data);
        } catch (error) {
            Alert.alert(t.ui.error, t.errors.fetchModules);
        } finally {
            setLoading(false);
        }
    }

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: colors.navbar }}>
            <View style={styles.container}>
                <Text style={styles.text}>{t.ui.filterModules}</Text>
                <View>
                    <TouchableOpacity
                        style={[styles.drawerItem, selectedTitle === null && styles.activeDrawerItem]}
                        onPress={() => {
                            setSelectedTitle(null)
                            props.navigation.closeDrawer();
                        }}
                    >
                        <Text style={[styles.drawerText, selectedTitle === null && styles.activeDrawerText]}>{t.ui.resetFilters}</Text>
                    </TouchableOpacity>
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
                                <Text style={[styles.drawerText, isActive && styles.activeDrawerText]}> {module.title}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    container: { padding: 15 },
    text: { color: colors?.textCard, fontSize: 25, fontWeight: 'bold', marginBottom: 20 },
    drawerItem: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#FFFFFF33' },
    drawerText: { color: colors?.textCard, fontSize: 20 },
    activeDrawerItem: { backgroundColor: '#0000004C', borderBottomWidth: 0 },
    activeDrawerText: { color: colors?.textCard, fontWeight: 'bold' }
});