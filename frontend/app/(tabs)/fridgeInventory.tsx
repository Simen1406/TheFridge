import { Text, View, StyleSheet } from "react-native";

export default function FridgeInventory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧊 Fridge Inventory</Text>
      <Text style={styles.subtitle}>See what's in your fridge</Text>
      <View style={styles.card}>
        <Text>🥛 Milk - 1 carton</Text>
      </View>
      <View style={styles.card}>
        <Text>🥚 Eggs - 6 remaining</Text>
      </View>
      <View style={styles.card}>
        <Text>🧀 Cheese - 200g</Text>
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
