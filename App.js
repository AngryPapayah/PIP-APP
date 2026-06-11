import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// dit is voor context enzo
import { LoadingProvider } from './src/contexts/LoadingContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import FilterProvider from "./src/contexts/FilterContext";

// dit zijn de screens
import { LoadingScreen } from './src/screens/LoadingScreen';
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import MainDrawerNavigator from "./src/navigation/MainDrawerNavigator";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading: authLoading } = useAuth();

    // Dit is voor eerste kee check of auth geweest is
    if (authLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="Main" component={MainDrawerNavigator} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <LoadingProvider>
            <AuthProvider>
                <FilterProvider>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </FilterProvider>
            </AuthProvider>
        </LoadingProvider>
    );
}
