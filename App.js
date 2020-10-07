import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import axios from "axios";

const PUSH_REGISTRATION_ENDPOINT = "http://819545f87054.ngrok.io/token";
const MESSAGE_ENPOINT = " http://819545f87054.ngrok.io/message";

export default function App() {
  const [notification, setNotification] = useState(null);
  const [messageText, setMessageText] = useState("");
  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== "granted") {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    return axios.post(PUSH_REGISTRATION_ENDPOINT, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      token: {
        value: token,
      },
      user: {
        username: "Chobby",
        name: "Woobin Kim",
      },
    });
    const notificationSubscription = Notifications.addListener(
      handleNotification
    );
  };

  const handleNotification = (notification) => {
    setNotification(notification);
  };
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  const handleChangeText = (text) => {
    setMessageText(text);
  };
  const sendMessage = async () => {
    axios.post(MESSAGE_ENPOINT, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      message: {
        message: messageText,
      },
    });
    setMessageText("");
  };
  return (
    <View style={styles.container}>
      <TextInput
        value={messageText}
        onChangeText={handleChangeText}
        style={styles.textInput}
      />
      <TouchableOpacity style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      {notification ? renderNotification() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    backgroundColor: "gray",
    width: 300,
    height: 50,
    color: "white",
  },
});
