import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";

export default function App() {
    return (
        //  For now if you want to see the login screen comment out the whole NavigationContainer and uncomment the LoginScreen. If you want to see behind the login screen, uncomment the NavigationContainer and comment out the LoginScreen.
        // <NavigationContainer>
        //     <BottomTabNavigator/>
        // </NavigationContainer>

        // <LoginScreen/>
        <SignupScreen/>
    );
}