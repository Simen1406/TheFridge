import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import FridgeTable from "@/components/fridgeTable";
import  { FridgeItem } from "@/types/foodTypes";
import { retrieveFridgeItems } from "@/services/api";
import { colors } from "@/themes/colors";
import AddFridgeForm from "@/components/fridgeItemForm";


export default function FridgeInventory() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await retrieveFridgeItems.getFridgeItems();
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
    retrieveFridgeItems.getFridgeItems().then((data) => setItems(data));
  };

  const handleItemRemoved = async (itemId: number) => {
    try {
      await retrieveFridgeItems.deleteFridgeItem(itemId);
      const data = await retrieveFridgeItems.getFridgeItems();
      setItems(data);
    } catch (error) {
      console.error(`Error deleting fridge item with id ${itemId}:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <FridgeTable items={items} onAddPress={() => setShowAddForm(true)} onRemovePress={handleItemRemoved} />
      <AddFridgeForm visible={showAddForm} onClose={() => setShowAddForm(false)} onItemAdded={handleItemAdded} />
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
