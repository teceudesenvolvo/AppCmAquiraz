const {onValueCreated} = require("firebase-functions/v2/database");
const {initializeApp} = require("firebase-admin/app");
const {getDatabase} = require("firebase-admin/database");
const {getMessaging} = require("firebase-admin/messaging");

// Inicializa Admin
initializeApp();

/**
 * Trigger do Realtime Database (SDK v2)
 */
exports.sendPushNotification = onValueCreated("/notifications/{notificationId}", async (event) => {
  const snapshot = event.data;
  const notificationData = snapshot.val();

  console.log("Nova notificação:", JSON.stringify(notificationData));

  const targetUserId = notificationData.targetUserId;
  if (!targetUserId) {
    console.log("Notificação sem targetUserId. Abortando.");
    return;
  }

  const db = getDatabase();
  const userSnapshot = await db.ref(`/users/${targetUserId}`).get();

  if (!userSnapshot.exists()) {
    console.log("Usuário não encontrado:", targetUserId);
    return;
  }

  const fcmToken = userSnapshot.val().fcmToken;

  if (!fcmToken) {
    console.log("Usuário sem fcmToken. Abortando.");
    return;
  }

  console.log(`Enviando notificação ao token: ${fcmToken}`);

  const payload = {
    notification: {
      title: notificationData.tituloNotification || "Você tem uma nova notificação!",
      body: notificationData.descricaoNotification || "Abra o app para ver os detalhes.",
    },
    data: {
      screen: "Notificacoes",
      notificationId: event.params.notificationId,
    },
  };

  try {
    const messaging = getMessaging();
    const response = await messaging.send({
      token: fcmToken,
      notification: payload.notification,
      data: payload.data,
    });
    console.log("Notificação enviada com sucesso:", response);
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
  }
});
