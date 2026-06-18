import {createStackNavigator} from "@react-navigation/stack";
import ModulesList from "../screens/courses/modules/ModulesList";
import HomeScreen from "../screens/HomeScreen";
import LessonsList from "../screens/courses/modules/lessons/LessonsList";
import QuestionsScreen from "../screens/QuestionsScreen";
import ResultScreen from "../screens/ResultScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
            <HomeStack.Screen name="HomeScreen" component={HomeScreen}/>
            <HomeStack.Screen name="Modules" component={ModulesList}/>
            <HomeStack.Screen name="Lessons" component={LessonsList}/>
            <HomeStack.Screen name="Questions" component={QuestionsScreen} options={{gestureEnabled: false}}/>
            <HomeStack.Screen name="ResultScreen" component={ResultScreen} options={{gestureEnabled: false}}/>
        </HomeStack.Navigator>
    );
}