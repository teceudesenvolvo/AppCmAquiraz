import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ref, set, get } from 'firebase/database';
import { DB } from '../firebaseConfig';

// Configura como as notificações devem se comportar com o app em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Falha ao obter o token para notificações push!');
      return;
    }
    // Use o ID do projeto do seu arquivo app.json
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'd55355f3-52be-4350-911a-352f2324bde9' })).data;
    console.log("Token de Notificação Expo:", token);
  } else {
    console.log('Deve usar um dispositivo físico para Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export const useNotifications = (user) => {
  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then(async (token) => {
        if (token) {
          const userRef = ref(DB, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            // Salva o token no perfil do usuário
            set(ref(DB, `users/${user.uid}/fcmToken`), token);
          }
        }
      });
    }
  }, [user]);
};