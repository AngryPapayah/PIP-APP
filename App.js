import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import MainDrawerNavigator from "./src/navigation/MainDrawerNavigator";
import FilterProvider from "./src/contexts/FilterContext";
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LoadingScreen } from './src/screens/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
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
        <AuthProvider>
            <FilterProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </FilterProvider>
        </AuthProvider>
    );
}