import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoadingProvider, useLoading } from './src/contexts/LoadingContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LanguageProvider from './src/contexts/LanguageContext';
import FilterProvider from './src/contexts/FilterContext';

import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import MainDrawerNavigator from "./src/navigation/MainDrawerNavigator";

import LessonsList from './src/screens/courses/modules/lessons/LessonsList';
import QuestionsScreen from './src/screens/QuestionsScreen';
import ResultScreen from './src/screens/ResultScreen';

import { CopilotProvider } from "react-native-copilot";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading: authLoading } = useAuth();
    const { loading: globalLoading } = useLoading();

    if (authLoading) {
        return <LoadingScreen />;
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={MainDrawerNavigator} />
                        <Stack.Screen name="LessonsList" component={LessonsList} />
                        <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
                        <Stack.Screen name="ResultScreen" component={ResultScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>

            {globalLoading && (
                <View style={StyleSheet.absoluteFill}>
                    <LoadingScreen />
                </View>
            )}
        </View>
    );
};

export default function App() {
    return (
        <LoadingProvider>
            <AuthProvider>
                <LanguageProvider>
                    <CopilotProvider labels={{ previous: "", next: "Next", skip: "Skip", finish: "Finish" }}>
                        <FilterProvider>
                            <NavigationContainer>
                                <AppNavigator />
                            </NavigationContainer>
                        </FilterProvider>
                    </CopilotProvider>
                </LanguageProvider>
            </AuthProvider>
        </LoadingProvider>
    );
}