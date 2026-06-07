import {createStackNavigator} from "@react-navigation/stack";
import CoursesList from "../screens/courses/CoursesList";
import ModulesList from "../screens/courses/modules/ModulesList";
import HomeScreen from "../screens/HomeScreen";
import LessonsList from "../screens/courses/modules/lessons/LessonsList";
import QuestionsScreen from "../screens/QuestionsScreen";

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
            <HomeStack.Screen name="HomeScreen" component={HomeScreen}/>
            <HomeStack.Screen name="Courses" component={CoursesList}/>
            <HomeStack.Screen name="Modules" component={ModulesList}/>
            <HomeStack.Screen name="Lessons" component={LessonsList}/>
            <HomeStack.Screen name="Questions" component={QuestionsScreen} options={{gestureEnabled: false}}/>
        </HomeStack.Navigator>
    );
}