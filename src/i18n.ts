import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip when larger, move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            'welcomeDashboard': 'Welcome to the team <1>{{teamName}}</1> dashboard!', 
            'Please select team': 'Please select team',            
            'Create service for team': 'Create service for team {{teamName}}',            
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;