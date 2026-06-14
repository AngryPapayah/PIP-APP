import {StyleSheet, Pressable, View, Text} from "react-native";
import {CustomButton} from "./CustomButton";
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../styles/GlobalStyles";

export const Card = ({iconName, lessonTitle, description, buttonText, estimated_time, onPress}) => {

    const isLocked = iconName === 'lock-closed';
    const isFinished = iconName === 'checkmark-circle';

    return (
        <Pressable onPress={onPress}
                   style={[styles.container, isLocked && styles.lockedCard, isFinished]}>
            <Text style={styles.titleText}>{lessonTitle}</Text>
            <Ionicons name={iconName} size={100} color={isFinished ? '#464712' : '#000'}></Ionicons>
            <Text>{estimated_time}</Text>
            <Text style={styles.descriptionText} numberOfLines={5}>{description}</Text>
            <CustomButton variant="primary" size="md" disabled={isLocked} onPress={onPress}
                          style={{alignSelf: 'stretch'}}>{buttonText}</CustomButton>
            {isFinished && <View style={styles.finishedCardOverlay}/>}
        </Pressable>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors?.secondary || '#C37E69',
        borderWidth: 2,
        borderColor: colors?.accent || '#784F4E',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        position: 'relative',
        overflow: 'hidden',
        alignSelf: 'stretch',
        flex: 1,

        aspectRatio: 1,
    },
    lockedCard: {
        opacity: 0.5
    },
    finishedCardOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#A6AA2C',
        opacity: 0.3,
        pointerEvents: 'none',
    },
    titleText: {
        paddingTop: '10',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    descriptionText: {
        fontSize: 18,
        padding: 10,
    }
})

