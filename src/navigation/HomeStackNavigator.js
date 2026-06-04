import {createStackNavigator} from "@react-navigation/stack";
import CoursesList from "../screens/CoursesList";
import ModulesList from "../screens/ModulesList";
import HomeScreen from "../screens/HomeScreen";

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}} id={}>
            <HomeStack.Screen name="HomeScreen" component={HomeScreen}/>
            <HomeStack.Screen name="Courses" component={CoursesList}/>
            <HomeStack.Screen name="Modules" component={ModulesList}/>
        </HomeStack.Navigator>
    );
}