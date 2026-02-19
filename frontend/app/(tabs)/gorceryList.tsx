import { Text, View, StyleSheet } from "react-native";

export default function GroceryList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Grocery List</Text>
      <Text style={styles.subtitle}>Items to buy</Text>
      <View style={styles.card}>
        <Text>☐ Bread</Text>
      </View>
      <View style={styles.card}>
        <Text>☐ Butter</Text>
      </View>
      <View style={styles.card}>
        <Text>☐ Apples</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
