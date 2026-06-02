// import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, colors} from './src/styles/GlobalStyles';

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={globalStyles.text}>Open up App.js to start working on your app!</Text>
            {/*<StatusBar style="auto" />*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
