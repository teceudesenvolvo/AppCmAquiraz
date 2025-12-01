import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AUTH,
  performInitialSignIn,
  onAuthStateChanged,
} from "./firebaseConfig";
import MainApp from "./MainApp"; // Navegador de abas
import LoginScreen from "./screens/Login";
import CadastroScreen from "./screens/Cadastro"; // Importa a tela de cadastro

// Importando as telas que serão navegadas a partir do Início
import TvCamaraScreen from "./screens/SubPages/TvCamara";
import VereadoresScreen from "./screens/SubPages/Vereadores";
import ProconScreen from "./screens/SubPages/Procon";
import LicitacoesScreen from "./screens/SubPages/Licitacoes";

// A inicialização do Firebase agora é feita dentro de firebaseConfig.js

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH, (userData) => {
      console.log("Auth state mudou:", userData ? userData.uid : "deslogado");

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
    console.log("App: Verificando autenticação...");
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

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Usuário está logado, mostra o app principal
          <>
            <Stack.Screen name="MainApp">
              {(props) => <MainApp {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="TvCamara" component={TvCamaraScreen} />
            <Stack.Screen name="Vereadores" component={VereadoresScreen} />
            <Stack.Screen name="Procon" component={ProconScreen} />
            <Stack.Screen name="Licitacoes" component={LicitacoesScreen} />
          </>
        ) : (
          // Usuário não está logado, mostra as telas de autenticação
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
