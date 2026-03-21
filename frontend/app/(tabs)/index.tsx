import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

import HeroHeader from "@/components/heroHeader";
import { ApiRequestError, pingApi } from "@/services/api";
import { colors } from "@/themes/colors";

// Home page
export default function Home() {
  const [status, setStatus] = useState("Not tested yet");

  const testConnection = async () => {
    try {
      setStatus("Testing connection...");
      const data = await pingApi();

      setStatus(`Connected, API Response: ${JSON.stringify(data)}`);
    } catch (error) {
      const errorMessage =
        error instanceof ApiRequestError
          ? `${error.message} (HTTP ${error.status})`
          : error instanceof Error
            ? error.message
            : "Unknown error";
      setStatus(`Connection failed: ${errorMessage}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <HeroHeader
        eyebrow="Home snapshot"
        title="Know what is in your fridge before you shop."
        subtitle="Track inventory, catch expiring items, and build smarter grocery runs."
        caption="Track your groceries and see what's in your fridge and cut waste."
        primaryAction={{ label: "Quick add item" }}
        secondaryAction={{ label: "Review expiring" }}
        stats={[
          { value: "18", label: "Tracked now" },
          { value: "3", label: "Expiring soon" },
          { value: "26%", label: "Waste cut" },
        ]}
        previewTitle="Fridge pulse"
        previewItems={["Inventory synced", "List prepared", "Expiry watch active"]}
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
