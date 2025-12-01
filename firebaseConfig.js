import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import {
    initializeAuth,
    getReactNativePersistence,
    signInWithCustomToken,
    onAuthStateChanged,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Config do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBGjXw1R8qtozYGQ4NeyNKYWfiLF_PHLhc",
    authDomain: "cm-aquiraz.firebaseapp.com",
    projectId: "cm-aquiraz",
    storageBucket: "cm-aquiraz.firebasestorage.app",
    messagingSenderId: "911998115784",
    appId: "1:911998115784:web:832cd8645683ebc83c6afd",
    measurementId: "G-GT37651WMY"
};

// Inicializa o app Firebase e os serviços associados.
// Esta abordagem garante que as instâncias sejam criadas uma única vez.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const AUTH = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const DB = getDatabase(app);
const FIRESTORE = getFirestore(app);

console.log("Módulo firebaseConfig carregado e serviços inicializados.");

/**
 * Realiza o login inicial usando um token customizado, se disponível.
 * @param {string} token - O token de autenticação customizado.
 */
async function performInitialSignIn(token) {
    if (!token) {
        console.log("Nenhum token customizado fornecido para o login inicial.");
        return;
    }
    try {
        await signInWithCustomToken(AUTH, token);
        console.log("Login inicial via token customizado realizado com sucesso.");
    } catch (e) {
        console.error("Erro CRÍTICO na autenticação inicial com token:", e);
    }
}

// Exporta as instâncias e funções diretamente
export {
    AUTH,
    DB,
    FIRESTORE,
    onAuthStateChanged,
    performInitialSignIn
}
