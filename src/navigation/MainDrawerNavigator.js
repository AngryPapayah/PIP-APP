import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerContent from "../screens/DrawerContent";

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerPosition: 'right'
            }}
        >
            <Drawer.Screen name="Tabs" component={BottomTabNavigator}/>
        </Drawer.Navigator>
    );
}