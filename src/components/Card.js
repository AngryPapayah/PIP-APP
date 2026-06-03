import {StyleSheet, Pressable, View} from "react-native";
import {CustomButton} from "./CustomButton";
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../styles/GlobalStyles";

export const Card = ({iconName, lessonTitle, onPress}) => {

    const isLocked = iconName === 'lock-closed';
    const isFinished = iconName === 'checkmark-circle';

    return (
        <Pressable onPress={onPress}
                   style={[styles.Container, isLocked && styles.LockedCard, isFinished]}>
            <Ionicons name={iconName} size={100} color={isFinished ? '#464712' : '#000'}></Ionicons>
            <CustomButton variant="primary" size="md" disabled={isLocked} onPress={onPress}>{lessonTitle}</CustomButton>
            {isFinished && <View style={styles.FinishedCardOverlay}/>}
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
        position: 'relative',
        overflow: 'hidden',
    },
    LockedCard: {
        opacity: 0.5
    },
    FinishedCardOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#A6AA2C',
        opacity: 0.3,
        pointerEvents: 'none',
    }
})

