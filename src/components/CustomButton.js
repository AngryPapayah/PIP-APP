import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, globalStyles} from "../styles/GlobalStyles.js";
import {Ionicons} from '@expo/vector-icons';


export const CustomButton = ({variant, size, onPress, children, disabled, style}) => {

    const isRightAnswer = variant === 'rightAnswer';
    const isWrongAnswer = variant === 'wrongAnswer';

    return (
        <TouchableOpacity onPress={onPress} style={[
            styles.buttonContainer,
            sizes[size],
            variants[variant],
            disabled && {opacity: 0.3},
            style
        ]}>
            <Text style={[
                styles.buttonText,
                variant === "questionButton" && {color: '#000'},
                isRightAnswer && {color: '#0700db'},
                isWrongAnswer && {color: '#000f01'}
            ]}>{children}</Text>

            {isRightAnswer && (
                <View accessible={true} style={styles.iconContainer} accessibilityLabel={"Correct awnser"}>
                    <Ionicons name="thumbs-up" size={18} color={'#047053'}></Ionicons>
                </View>
            )}

            {isWrongAnswer && (
                <View accessible={true} style={styles.iconContainer} accessibilityLabel={"Wrong awnser"}>
                    <Ionicons name="thumbs-down" size={18} color={'#802636'}></Ionicons>
                </View>
            )}
        </TouchableOpacity>
    )
}

const variants = {
    primary: {
        backgroundColor: colors?.primaryButton || '#F09D67',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors?.accent || '#784F4E'
    },
    questionButton: {
        backgroundColor: '#E2C495',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors?.accent || '#784F4E',
    },
    rightAnswer: {
        backgroundColor: colors?.rightButton || '#06D6A0',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors?.accent || '#784F4E',
        position: 'relative',
        paddingBottom: 20,

    },
    wrongAnswer: {
        backgroundColor: colors?.wrongButton || '#EF476F',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors?.accent || '#784F4E'
    },
    icon: {backgroundColor: 'transparent'},
}

const sizes = {
    sm: {paddingVertical: 6, paddingHorizontal: 16},
    md: {paddingVertical: 10, paddingHorizontal: 32},
    lg: {paddingVertical: 14, paddingHorizontal: 45},
};

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 10,
    },
    buttonText: {
        fontSize: globalStyles?.text.fontSize || 18,
        textAlign: 'center',
        color: '#0d0d0d',
        fontWeight: 'bold'
    },
    iconContainer: {
        position: 'absolute',
        bottom: 8,
        right: 12,
    }
})