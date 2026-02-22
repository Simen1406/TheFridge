import { colors } from "@/themes/colors";
import { Text, View, StyleSheet, Button } from "react-native";
import { useState } from "react";

const API_URL = "http://localhost:8000";


// Home page

export default function Home() {
  const [status, setStatus] = useState("Loading...");

  const testConnection = async () => {
    try {
      setStatus("Testing connection...");
      const response = await fetch(`${API_URL}/ping`);
      const data = await response.json();
      
      setStatus(` Connected, API Response: ${JSON.stringify(data)}`);
    } catch (error) {
      setStatus(`Connection failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}>Welcome to the Fridge App</Text>
      <View style={styles.card}>
        <Text>Your fridge summary will appear here</Text>
        <Text>API status: {status}</Text>
        <Button title="Test API Connection" onPress={testConnection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});