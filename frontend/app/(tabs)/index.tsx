import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

import FridgeHero from "@/components/fridgeHero";
import { colors } from "@/themes/colors";

const API_URL = "http://localhost:8000";

// Home page
export default function Home() {
  const [status, setStatus] = useState("Not tested yet");

  const testConnection = async () => {
    try {
      setStatus("Testing connection...");
      const response = await fetch(`${API_URL}/ping`);
      const data = await response.json();

      setStatus(`Connected, API Response: ${JSON.stringify(data)}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Connection failed: ${errorMessage}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <FridgeHero
        title="Inside The Fridge"
        subtitle="Restock in motion"
        caption="Ingredients drift shelf-to-shelf to simulate a freshly organized fridge."
      />

      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Welcome to the Fridge App</Text>

      <View style={styles.card}>
        <Text style={styles.bodyText}>Your fridge summary will appear here</Text>
        <Text style={styles.bodyText}>API status: {status}</Text>
        <Button title="Test API Connection" onPress={testConnection} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  bodyText: {
    color: colors.white,
  },
});
