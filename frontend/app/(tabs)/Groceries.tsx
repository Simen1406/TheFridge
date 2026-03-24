import { View, StyleSheet, Platform } from "react-native";
import { colors } from "@/themes/colors";
import GroceryTable from "@/components/groceryTable";
import { useEffect, useState } from "react";
import { GroceryItem } from "@/types/foodTypes";
import { retrieveGroceryItems } from "@/services/api";
import AddGroceryForm from "@/components/groceryItemForm";
import SharedNav from "@/components/navComponent";

export default function FridgeInventory() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await retrieveGroceryItems.getGroceryItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching grocery items:", error);
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
    retrieveGroceryItems
      .getGroceryItems()
      .then((data) => setItems(data))
      .finally(() => setIsLoading(false));
  };

  const handleItemRemoved = async (itemId: number) => {
    try {
      await retrieveGroceryItems.deleteGroceryItem(itemId);
      const data = await retrieveGroceryItems.getGroceryItems();
      setItems(data);
    } catch (error) {
      console.error(`Error deleting fridge item with id ${itemId}:`, error);
    }
  };
  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? <SharedNav /> : null}
      <View style={styles.content}>
      <GroceryTable
        items={items}
        onAddPress={() => setShowAddForm(true)}
        onRemovePress={handleItemRemoved}
        isLoading={isLoading}
      />
      <AddGroceryForm visible={showAddForm} onClose={() => setShowAddForm(false)} onItemAdded={handleItemAdded} />
      </View>
    </View>
  )
};

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
  }
});
