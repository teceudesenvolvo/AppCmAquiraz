import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseOnAuthStateChanged,
  performInitialSignIn,
} from "./firebaseConfig";
import MainApp from "./MainApp"; // 1. Importa o seu aplicativo principal

// Objeto de configuração do Firebase (substitua com seus dados reais)
const firebaseConfig = {
  apiKey: "AIzaSyBGjXw1R8qtozYGQ4NeyNKYWfiLF_PHLhc",
  authDomain: "cm-aquiraz.firebaseapp.com",
  projectId: "cm-aquiraz",
  storageBucket: "cm-aquiraz.firebasestorage.app",
  messagingSenderId: "911998115784",
  appId: "1:911998115784:web:832cd8645683ebc83c6afd",
  measurementId: "G-GT37651WMY"
};

// Inicializa o Firebase uma única vez na inicialização do app
initializeFirebase(firebaseConfig);

/**
 * Componente de wrapper que gerencia o estado de autenticação do Firebase.
 * Ele mostra uma tela de carregamento enquanto verifica o usuário.
 */
function AuthWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  console.log("AppWrapper: Iniciando componente.");

  useEffect(() => {
    // O listener de autenticação precisa ser registrado antes de qualquer outra coisa.
    const auth = getFirebaseAuth();
    const onAuth = getFirebaseOnAuthStateChanged();

    console.log("Registrando listener de autenticação...");
    const unsubscribe = onAuth(auth, (userData) => {
      console.log("Auth state mudou:", userData ? userData.uid : "deslogado");
      setUser(userData);
      setIsLoading(false); // Remove o loading assim que o estado de auth é conhecido
    });

    // Função assíncrona para lidar com a inicialização e login
    const initializeAndSignIn = async () => {
      // Verifica se um token de autenticação inicial foi injetado no app
      const initialAuthToken =
        typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;
      
      // Tenta fazer o login inicial com o token
      await performInitialSignIn(initialAuthToken);
    };

    initializeAndSignIn();

    return () => {
      unsubscribe(); // Limpa o listener ao desmontar o componente
    };
  }, []);

  if (isLoading) {
    console.log("AppWrapper: Renderizando tela de carregamento.");
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  console.log("AppWrapper: Renderizando children (app pronto).");
  return React.cloneElement(children, { user });
}

/**
 * Este é o componente raiz do aplicativo.
 * Ele usa o AuthWrapper para garantir que o Firebase esteja pronto
 * antes de renderizar o aplicativo principal (MainApp).
 */
export default function App() {
  return (
    <AuthWrapper>
      <MainApp /> 
    </AuthWrapper>
  );
}
