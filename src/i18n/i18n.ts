// import * as RNLocalize from 'react-native-localize';
// import i18n from 'i18n-js';
// import en from './en.json';
// import ar from './ar.json';

// i18n.fallbacks = true;
// i18n.translations = {en, ar};

// i18n.locale = RNLocalize.getLocales()[0].languageCode || 'en';

/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
// type DefaultLocale = typeof en;
// export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

// type RecursiveKeyOf<TObj extends Record<string, any>> = {
//   [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
//     ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
//     : `${TKey}`;
// }[keyof TObj & string];
