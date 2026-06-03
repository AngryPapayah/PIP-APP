import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 26,
        fontWeight: 'semibold',
        fontFamily: 'inter',
        marginBottom: 16,
    },

    text: {
        fontSize: 18,
        fontFamily: 'inter',
    },
});

export const colors = {
    primary: '#FFDFAD',
    secondary: '#C37E69',
    navbar: '#9E6655',
    accent: '#784F4E',
    textMain: '#000000',
    textCard: '#FFFFFF',

    primaryButton: '#F09D67',
    rightButton: '#06D6A0',
    wrongButton: '#EF476F',

    //xp-bar
    xpBarFiller: '#676848',
    xpBarBackground: '#D5B49E',
    xpBarIndicator: '#A6AA2C',

    //progress bar
    progressBarFiller: '#909160',
    progressBarBackground: '#E2C495',

    warning: '#FFCC00',
    error: '#FF3B3B',


};