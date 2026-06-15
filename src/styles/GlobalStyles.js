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
    primary: '#F4E1C1',
    secondary: '#FFFFFF',
    navbar: '#6D4C41',
    accent: '#784F4E',
    textMain: '#141414',
    textCard: '#FFFFFF',

    primaryButton: '#D97706',
    rightButton: '#05b689',
    wrongButton: '#da4063',

    //xp-bar
    xpBarFiller: '#676848',
    xpBarBackground: '#D5B49E',
    xpBarIndicator: '#A6AA2C',

    //progress bar
    progressBarFiller: '#6e7318',
    progressBarBackground: '#edc560',
    progressBarActive: '#909160',
    progressBarInactive: '#E2C495',

    warning: '#FFCC00',
    error: '#FF3B3B',


};