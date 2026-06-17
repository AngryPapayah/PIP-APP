import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {PipMessages} from '../constants/PipMessages';

const LanguageContext = createContext();

export default function LanguageProvider({children}) {
    const [language, setLanguageState] = useState('en');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('userLanguage');

                if (savedLanguage) {
                    setLanguageState(savedLanguage);
                } else {
                    // const deviceLanguage = Localization.getLocales()[0].languageCode;
                    // const initialLang = deviceLanguage === 'nl' ? 'nl' : 'en';
                    setLanguageState('en');
                }
            } catch (e) {
                console.error("Error loading language settings from storage:", e);
            } finally {
                setLoading(false);
            }
        };

        loadLanguage();
    }, []);

    const setLanguage = async (newLang) => {
        try {
            setLanguageState(newLang);
            await AsyncStorage.setItem('userLanguage', newLang);
        } catch (e) {
            console.error("Error saving language setting to storage:", e);
        }
    };

    const t = PipMessages[language] || PipMessages['en'];

    if (loading) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{language, setLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);