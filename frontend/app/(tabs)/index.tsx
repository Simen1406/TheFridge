import { colors } from "@/themes/colors";
import { Text, View, StyleSheet } from "react-native";

// Home page

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}>Welcome to the Fridge App</Text>
      <View style={styles.card}>
        <Text>Your fridge summary will appear here</Text>
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