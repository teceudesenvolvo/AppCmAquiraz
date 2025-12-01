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

// Variáveis para armazenar as instâncias dos serviços Firebase
let app;
let AUTH;
let DB;
let FIRESTORE;

/**
 * Inicializa o app Firebase e os serviços associados (Auth, DB, Firestore).
 * Garante que a inicialização ocorra apenas uma vez.
 * @param {object} firebaseConfig - O objeto de configuração do Firebase.
 */
export function initializeFirebase(firebaseConfig) {
    if (app) return; // Evita reinicialização

    try {
        if (getApps().length === 0) {
            app = initializeApp(firebaseConfig);
            console.log("Firebase App inicializado com sucesso.");
        } else {
            app = getApp();
            console.log("Instância do Firebase App já existente foi obtida.");
        }

        AUTH = initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage)
        });
        DB = getDatabase(app);
        FIRESTORE = getFirestore(app);

        console.log("Firebase services (Auth, DB, Firestore) initialized.");

    } catch (error) {
        console.error("Erro CRÍTICO na inicialização do Firebase:", error);
    }
}

// --- Getters para os serviços ---
// Garantem que os serviços só sejam retornados se a inicialização tiver ocorrido.
export function getFirebaseAuth() {
    if (!AUTH) throw new Error("Serviço de Autenticação não inicializado. Chame initializeFirebase() primeiro.");
    return AUTH;
}

export function getFirebaseDb() {
    if (!DB) throw new Error("Serviço de Database não inicializado. Chame initializeFirebase() primeiro.");
    return DB;
}

export function getFirebaseFirestore() {
    if (!FIRESTORE) throw new Error("Serviço Firestore não inicializado. Chame initializeFirebase() primeiro.");
    return FIRESTORE;
}

export function getFirebaseOnAuthStateChanged() {
    if (!AUTH) throw new Error("Serviço de Autenticação não inicializado. Chame initializeFirebase() primeiro.");
    return onAuthStateChanged;
}

/**
 * Realiza o login inicial usando um token customizado, se disponível.
 * @param {string} token - O token de autenticação customizado.
 */
export async function performInitialSignIn(token) {
    if (!token) {
        console.log("Nenhum token customizado fornecido para o login inicial.");
        return;
    }
    try {
        const auth = getFirebaseAuth();
        await signInWithCustomToken(auth, token);
        console.log("Login inicial via token customizado realizado com sucesso.");
    } catch (e) {
        console.error("Erro CRÍTICO na autenticação inicial com token:", e);
    }
}
