import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../styles/GlobalStyles';
import ProfileScreen from "../screens/ProfileScreen";
import HamsterverseScreen from "../screens/HamsterverseScreen";
import {Ionicons} from '@expo/vector-icons';
import {Image, TouchableOpacity} from "react-native";
import HomeStackScreen from "./HomeStackNavigator";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({navigation}) {
    return (
        <Tab.Navigator
            initialRouteName="Home"
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
                headerTitleStyle: {
                    fontSize: 24,
                    fontWeight: 'bold',
                },
                headerTitle: 'P.I.P.',
                headerLeft: () => (
                    <Image
                        source={require('../../public/images/pip-head.png')}
                        style={{width: 80, height: 80, marginLeft: 15,}}
                        resizeMode="contain"
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{marginRight: 15}}>
                        <Ionicons name="menu" size={30} color={colors.textCard}/>
                    </TouchableOpacity>
                ),
            }}
            id={}>

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
                component={HomeStackScreen}
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