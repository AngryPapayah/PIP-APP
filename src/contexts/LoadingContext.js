import React, { createContext, useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ setLoading }}>
            {children}
            {/* Het laadscherm zelf */}
            <Modal transparent={true} visible={loading} animationType="fade">
                <View style={styles.container}>
                    <View style={styles.loaderBox}>
                        <ActivityIndicator size="large" color="#FFDFAD" />
                        <Text style={styles.text}>Laden...</Text>
                    </View>
                </View>
            </Modal>
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Dim de achtergrond
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderBox: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    text: {
        color: '#FFF',
        marginTop: 10,
        fontWeight: 'bold',
    }
});
