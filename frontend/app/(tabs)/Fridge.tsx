import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";


import FridgeTable from "@/components/fridgeTable";
import AddItemForm from "@/components/addItemForm";
import { api } from "@/services/api";
import { colors } from "@/themes/colors";

export default function FridgeInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await api.getFridgeItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching fridge items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleItemAdded = () => {
    setShowAddForm(false);
    // Refresh the items list
    api.getFridgeItems().then((data) => setItems(data));
  };

  return (
    <View style={styles.container}>
      <FridgeTable items={items} />
      <AddItemForm visible={showAddForm} onClose={() => setShowAddForm(false)} onItemAdded={handleItemAdded} />
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
