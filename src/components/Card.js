import {StyleSheet, Pressable} from "react-native";
import {CustomButton} from "./CustomButton";
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../styles/GlobalStyles";

export const Card = ({iconName, lesson, onPress}) => {

    const isLocked = iconName === 'lock-closed';
    const isFinished = iconName === 'checkmark-circle';

    return (
        <Pressable onPress={onPress}
                   style={[styles.Container, isLocked && styles.LockedCard, isFinished && styles.FinishedCard]}>
            <Ionicons name={iconName} size={100}></Ionicons>
            <CustomButton variant="primary" size="md" disabled={isLocked} onPress={onPress}>{lesson}</CustomButton>
        </Pressable>

    )
}

const styles = StyleSheet.create({
    Container: {
        backgroundColor: colors?.secondary || '#C37E69',
        borderWidth: 2,
        borderColor: colors?.accent || '#784F4E',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    LockedCard: {
        opacity: 0.5
    },
    FinishedCard: {}
})

