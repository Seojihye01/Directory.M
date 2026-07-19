import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationKO from './locales/ko.json';
import translationEN from './locales/en.json';

const resources = {
  ko: { translation: translationKO },
  en: { translation: translationEN },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 감지 및 저장 기능 활성화
  .use(initReactI18next) // i18next를 react-i18next와 연동
  .init({
    resources,
    fallbackLng: 'en', // 감지된 언어가 없을 때 사용할 기본 언어
    debug: false,
    interpolation: {
      escapeValue: false, // 리액트는 자체적으로 XSS 방지를 하므로 false 설정
    },
    detection: {
      order: ['localStorage', 'navigator'], // 로컬스토리지 먼저 확인 후 브라우저 언어 확인
      caches: ['localStorage'], // 유저가 선택한 언어를 로컬스토리지에 저장
    }
  });

export default i18n;

export {};