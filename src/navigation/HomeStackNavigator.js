import {createStackNavigator} from "@react-navigation/stack";
import CoursesList from "../screens/courses/CoursesList";
import ModulesList from "../screens/courses/modules/ModulesList";
import HomeScreen from "../screens/HomeScreen";
import LessonsList from "../screens/courses/modules/lessons/LessonsList";

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
            <HomeStack.Screen name="HomeScreen" component={HomeScreen}/>
            <HomeStack.Screen name="Courses" component={CoursesList}/>
            <HomeStack.Screen name="Modules" component={ModulesList}/>
            <HomeStack.Screen name="Lessons" component={LessonsList}/>
        </HomeStack.Navigator>
    );
}