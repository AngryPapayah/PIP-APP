import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import CoursesList from "./CoursesList";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={globalStyles?.text || styles.text}>Your Courses</Text>
            <CoursesList></CoursesList>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.primary || '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
    }
});