import { View, StyleSheet } from "react-native";
import { colors } from "@/themes/colors";
import GroceryTable from "@/components/groceryTable";
import { useEffect, useState } from "react";
import { GroceryItem } from "@/types/foodTypes";
import { retrieveGroceryItems } from "@/services/api";
import AddGroceryForm from "@/components/groceryItemForm";

export default function FridgeInventory() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await retrieveGroceryItems.getGroceryItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching grocery items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleItemAdded = () => {
    setShowAddForm(false);
    // Refresh the items list
    retrieveGroceryItems.getGroceryItems().then((data) => setItems(data));
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
      <GroceryTable items={items} onAddPress={() => setShowAddForm(true)} onRemovePress={handleItemRemoved} />
      <AddGroceryForm visible={showAddForm} onClose={() => setShowAddForm(false)} onItemAdded={handleItemAdded} />
    </View>  
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: "center",
  }
});
