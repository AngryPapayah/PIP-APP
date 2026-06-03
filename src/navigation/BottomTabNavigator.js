import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {colors} from '../styles/GlobalStyles';
import ProfileScreen from "../screens/ProfileScreen";
import HamsterverseScreen from "../screens/HamsterverseScreen";
import {Ionicons} from '@expo/vector-icons';

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

            <Tab.Screen
                name="Hamsterverse"
                component={HamsterverseScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="planet" color={color} size={size}/>
                    ),
                }}
            />

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home" color={color} size={size}/>
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="person" color={color} size={size}/>
                    ),
                }}
            />

        </Tab.Navigator>
    );
}