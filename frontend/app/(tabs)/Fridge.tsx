import { Text, View, StyleSheet } from "react-native";
import FridgeTable from "@/components/fridgeTable";
import { mockFridgeItems } from "@/data/fridgeItems";
import { colors } from "@/themes/colors";

export default function FridgeInventory() {
  return (
    <View style={styles.container}>
      <FridgeTable items={mockFridgeItems} />
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
});
