import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { Link, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  GetStarted: undefined;
  UserDetails: undefined;
};

export type GetStartedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GetStarted'
>;
const WelcomeScreen = () => {
  const navigation = useNavigation<GetStartedScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.logo}>🤖</Text>
      <Text style={styles.title}>GymBro</Text>
      <Text style={styles.subtitle}>🎉 New Year, New You! Get Healthier in 2025 🎄</Text>
      <Text style={styles.description}>
        Hey 👋 I am your <Text style={styles.highlight}>Personal Trainer</Text> powered by AI 💪.
        I will ask you some questions to personalize a smart workout plan for you.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserDetails')}>
      <Text style={styles.buttonText}>Let's Start!</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A1E", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  logo: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#fff", textAlign: "center", marginBottom: 10 },
  description: { fontSize: 14, color: "#d1d1d1", textAlign: "center", marginBottom: 15 },
  highlight: { fontWeight: "bold", color: "#4CAF50" },
  button: { backgroundColor: "#1E90FF", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default WelcomeScreen;
