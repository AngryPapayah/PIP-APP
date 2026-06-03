import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {colors} from '../styles/GlobalStyles';
import ProfileScreen from "../screens/ProfileScreen";
import HamsterverseScreen from "../screens/HamsterverseScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.navbar,
                },
                tabBarActiveTintColor: colors.textCard,
                tabBarInactiveTintColor: colors.textMain,
                headerStyle: {
                    backgroundColor: colors.navbar,
                },
                headerTintColor: colors.textCard,
            }}
        >
            <Tab.Screen name="Hamsterverse" component={HamsterverseScreen}/>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
            {/*<Tab.Screen name="Profile" component={ProfileScreen}/>*/}
        </Tab.Navigator>
    );
}