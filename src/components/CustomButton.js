import {Text, StyleSheet, Pressable, View} from 'react-native';
import {colors, globalStyles} from "../styles/GlobalStyles.js";
import FontAwesome from '@expo/vector-icons/FontAwesome';


export const CustomButton = ({variant, size, onPress, children, disabled}) => {

    const isRightAnswer = variant === 'rightAnswer';
    const isWrongAnswer = variant === 'wrongAnswer';

    return (
        <Pressable onPress={onPress} style={[
            styles.ButtonContainer,
            sizes[size],
            variants[variant],
            disabled && {opacity: 0.3}
        ]}>
            <Text style={styles.ButtonText}>{children}</Text>

            {isRightAnswer && (
                <View style={styles.IconContainer}>
                    <FontAwesome name="thumbs-up" size={18} color={'#047053'}></FontAwesome>
                </View>
            )}

            {isWrongAnswer && (
                <View style={styles.IconContainer}>
                    <FontAwesome name="thumbs-down" size={18} color={'#802636'}></FontAwesome>
                </View>
            )}
        </Pressable>
    )
}

const variants = {
    primary: {
        backgroundColor: colors.primaryButton,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.accent
    },
    rightAnswer: {
        backgroundColor: colors.rightButton,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.accent,
        position: 'relative',
        paddingBottom: 20,

    },
    wrongAnswer: {
        backgroundColor: colors.wrongButton,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.accent
    },
    icon: {backgroundColor: 'transparent'},
}

const sizes = {
    sm: {paddingVertical: 6, paddingHorizontal: 16},
    md: {paddingVertical: 10, paddingHorizontal: 32},
    lg: {paddingVertical: 14, paddingHorizontal: 45},
};

const styles = StyleSheet.create({
    ButtonContainer: {
        margin: 10,
    },
    ButtonText: {
        fontSize: globalStyles.text.fontSize,
        textAlign: 'center',
    },
    IconContainer: {
        position: 'absolute',
        bottom: 8,
        right: 12,
    }
})