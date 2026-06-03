import {Text, StyleSheet, Pressable, View} from 'react-native';
import {colors, globalStyles} from "../styles/GlobalStyles.js";
import {Ionicons} from '@expo/vector-icons';


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
                    <Ionicons name="thumbs-up" size={18} color={'#047053'}></Ionicons>
                </View>
            )}

            {isWrongAnswer && (
                <View style={styles.IconContainer}>
                    <Ionicons name="thumbs-down" size={18} color={'#802636'}></Ionicons>
                </View>
            )}
        </Pressable>
    )
}

const variants = {
    primary: {
        backgroundColor: colors?.primaryButton || '#F09D67',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors?.accent || '#784F4E'
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
    ButtonContainer: {
        margin: 10,
    },
    ButtonText: {
        fontSize: globalStyles?.text.fontSize || 18,
        textAlign: 'center',
    },
    IconContainer: {
        position: 'absolute',
        bottom: 8,
        right: 12,
    }
})