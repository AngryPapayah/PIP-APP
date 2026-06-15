import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../styles/GlobalStyles';
import ProfileScreen from "../screens/ProfileScreen";
import HamsterverseScreen from "../screens/HamsterverseScreen";
import {Ionicons} from '@expo/vector-icons';
import {Image, TouchableOpacity, Text} from "react-native";
import HomeStackScreen from "./HomeStackNavigator";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {

    const navigation = useNavigation()

    const PlanetIcon = ({color, size}) => (
        <Ionicons name="planet" color={color} size={size}/>
    );

    const HomeIcon = ({color, size}) => (
        <Ionicons name="home" color={color} size={size}/>
    );

    const ProfileIcon = ({color, size}) => (
        <Ionicons name="person" color={color} size={size}/>
    );

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.navbar,
                },
                tabBarActiveTintColor: '#fcf8f2',
                tabBarInactiveTintColor: '#feead2',
                headerStyle: {
                    backgroundColor: colors.navbar,
                },
                headerTitle: () => (
                    <Text
                        style={{
                            color: colors.textCard,
                            fontSize: 24,
                            fontWeight: 'bold',
                        }}
                        accessible={false}
                    >P.I.P.</Text>
                ),
                headerLeft: () => (
                    <Image
                        source={require('../../public/images/pip-head.png')}
                        style={{width: 80, height: 80, marginLeft: 15,}}
                        resizeMode="contain"
                        accessible={false}
                    />
                ),
                headerRight: () => (
                    //open the drawer from clicking on menu button
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        style={{marginRight: 15}}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Open menu"
                        accessibilityHint="Opens the side navigation drawer"
                    >
                        <Ionicons name="menu" size={30} color={colors.textCard}/>
                    </TouchableOpacity>
                ),
            }}>

            <Tab.Screen
                name="Hamsterverse"
                component={HamsterverseScreen}
                options={{
                    tabBarIcon: PlanetIcon,
                    tabBarAccessibilityLabel: "Hamsterverse tab",
                }}
            />

            <Tab.Screen
                name="Home"
                component={HomeStackScreen}
                options={({route}) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';
                    const isQuestionsScreen = routeName === 'Questions';
                    const isResultScreen = routeName === 'ResultScreen';
                    const hideHeaderAndTab = isQuestionsScreen || isResultScreen;

                    return {
                        headerShown: !hideHeaderAndTab,
                        tabBarAccessibilityLabel: "Home tab",
                        tabBarStyle: {
                            display: hideHeaderAndTab ? 'none' : 'flex',
                            backgroundColor: colors.navbar,
                        },
                        tabBarIcon: HomeIcon,
                    };
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ProfileIcon,
                    tabBarAccessibilityLabel: "Profile tab",
                }}
            />

        </Tab.Navigator>
    );
}