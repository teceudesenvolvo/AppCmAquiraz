import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseOnAuthStateChanged,
  performInitialSignIn,
} from "./firebaseConfig";
import MainApp from "./MainApp";
import LoginScreen from "./screens/Login"; // <-- CERTIFIQUE-SE QUE EXISTE

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

// Inicializa Firebase uma única vez
initializeFirebase(firebaseConfig);

function AuthWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  console.log("AuthWrapper: inicializando...");

  useEffect(() => {
    const auth = getFirebaseAuth();
    const onAuth = getFirebaseOnAuthStateChanged();

    console.log("Registrando listener do Firebase Auth...");
    
    // Listener oficial do Firebase
    const unsubscribe = onAuth(auth, (userData) => {
      console.log("🔥 Auth state mudou:", userData ? userData.uid : "deslogado");

      setUser(userData);
      setIsLoading(false);
    });

    // Tentativa de login automático via custom token
    const initializeAndSignIn = async () => {
      const initialAuthToken =
        typeof __initial_auth_token !== "undefined"
          ? __initial_auth_token
          : null;

      await performInitialSignIn(initialAuthToken);
    };

    initializeAndSignIn();

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    console.log("AuthWrapper: renderizando loader...");
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

  // ⚠️ Se não há usuário logado, abre Login
  if (!user) {
    console.log("AuthWrapper: nenhum usuário → exibindo Login");
    return <LoginScreen />;
  }

  // ✔️ Usuário existe → renderiza app
  console.log("AuthWrapper: usuário autenticado → abrindo MainApp");
  return React.cloneElement(children, { user });
}

export default function App() {
  return (
    <AuthWrapper>
      <MainApp />
    </AuthWrapper>
  );
}
