import { View, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";

import FridgeTable from "@/components/fridgeTable";
import  { FridgeItem } from "@/types/foodTypes";
import { retrieveFridgeItems } from "@/services/api";
import { colors } from "@/themes/colors";
import AddFridgeForm from "@/components/fridgeItemForm";
import SharedNav from "@/components/navComponent";


export default function FridgeInventory() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await retrieveFridgeItems.getFridgeItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching fridge items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleItemAdded = () => {
    setShowAddForm(false);
    // Refresh the items list
    setIsLoading(true);
    retrieveFridgeItems
      .getFridgeItems()
      .then((data) => setItems(data))
      .finally(() => setIsLoading(false));
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
      {Platform.OS === "web" ? <SharedNav /> : null}
      <View style={styles.content}>
      <FridgeTable
        items={items}
        onAddPress={() => setShowAddForm(true)}
        onRemovePress={handleItemRemoved}
        isLoading={isLoading}
      />
      <AddFridgeForm visible={showAddForm} onClose={() => setShowAddForm(false)} onItemAdded={handleItemAdded} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 35,
    padding: 20,
    alignItems: "center",
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
