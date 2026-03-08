import { StyleSheet, Text, View } from "react-native";

import { FridgeItem } from "@/types/foodTypes";
import { colors } from "@/themes/colors";

const commonFridgeItems: FridgeItem[] = [
  {
    id: 1,
    ean: "100000000001",
    name: "Milk",
    brand: "Tine",
    price: 29.9,
    weight: 1,
    weight_unit: "L",
    image: "",
    expiration_date: "2026-03-14",
  },
  {
    id: 2,
    ean: "100000000002",
    name: "Eggs",
    brand: "Prior",
    price: 44.9,
    weight: 12,
    weight_unit: "pcs",
    image: "",
    expiration_date: "2026-03-20",
  },
  {
    id: 3,
    ean: "100000000003",
    name: "Butter",
    brand: "Bremykt",
    price: 39.9,
    weight: 500,
    weight_unit: "g",
    image: "",
    expiration_date: "2026-04-01",
  },
  {
    id: 4,
    ean: "100000000004",
    name: "Yogurt",
    brand: "Q",
    price: 24.9,
    weight: 500,
    weight_unit: "g",
    image: "",
    expiration_date: "2026-03-18",
  },
];

export default function CommonFridgeItemsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common Fridge Items</Text>
      {commonFridgeItems.map((item) => (
        <Text key={item.id} style={styles.item}>
          {item.name}
        </Text>
      ))}
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
});
