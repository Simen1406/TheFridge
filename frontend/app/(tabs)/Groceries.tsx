import { View, StyleSheet, Platform, Text, TouchableOpacity } from "react-native";
import { colors } from "@/themes/colors";
import GroceryTable from "@/components/groceryTable";
import { useEffect, useRef, useState } from "react";
import { GroceryItem } from "@/types/foodTypes";
import { retrieveGroceryItems } from "@/services/api";
import AddGroceryForm from "@/components/groceryItemForm";
import SharedNav from "@/components/navComponent";

export default function FridgeInventory() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeletes, setPendingDeletes] = useState<
    { item: GroceryItem; index: number }[]
  >([]);
  const deleteTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

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

    return () => {
      deleteTimers.current.forEach((timerId) => clearTimeout(timerId));
      deleteTimers.current.clear();
    };
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

  const handleItemRemoved = (itemId: number) => {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;

    const index = items.findIndex((entry) => entry.id === itemId);
    setItems((current) => current.filter((entry) => entry.id !== itemId));
    setPendingDeletes((current) =>
      current.some((entry) => entry.item.id === itemId)
        ? current
        : [...current, { item, index }],
    );

    const timerId = setTimeout(async () => {
      deleteTimers.current.delete(itemId);

      try {
        await retrieveGroceryItems.deleteGroceryItem(itemId);
        setPendingDeletes((current) => current.filter((entry) => entry.item.id !== itemId));
      } catch (error) {
        console.error(`Error deleting grocery item with id ${itemId}:`, error);
        setItems((current) => restoreItem(current, item, index));
        setPendingDeletes((current) => current.filter((entry) => entry.item.id !== itemId));
      }
    }, 5000);

    const existingTimer = deleteTimers.current.get(itemId);
    if (existingTimer) clearTimeout(existingTimer);
    deleteTimers.current.set(itemId, timerId);
  };

  const undoDelete = (itemId: number) => {
    const timerId = deleteTimers.current.get(itemId);
    if (timerId) clearTimeout(timerId);
    deleteTimers.current.delete(itemId);

    setPendingDeletes((current) => {
      const entry = current.find((pending) => pending.item.id === itemId);
      if (!entry) return current;

      setItems((itemsList) => restoreItem(itemsList, entry.item, entry.index));
      return current.filter((pending) => pending.item.id !== itemId);
    });
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
      {pendingDeletes.length > 0 ? (
        <View style={styles.undoStack}>
          {pendingDeletes.map((entry) => (
            <View key={entry.item.id} style={styles.undoBanner}>
              <View style={styles.undoCopy}>
                <Text style={styles.undoTitle}>{entry.item.name} queued for deletion</Text>
                <Text style={styles.undoText}>It will be removed from the server in 5 seconds.</Text>
              </View>
              <TouchableOpacity
                onPress={() => undoDelete(entry.item.id)}
                style={styles.undoButton}
                accessibilityRole="button"
                accessibilityLabel={`Undo delete for ${entry.item.name}`}
              >
                <Text style={styles.undoButtonText}>Undo</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
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
  },
  undoStack: {
    width: "100%",
    gap: 8,
    marginTop: 12,
  },
  undoBanner: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "rgba(211, 211, 211, 0.72)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  undoCopy: {
    flex: 1,
    gap: 2,
  },
  undoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.headerText,
  },
  undoText: {
    fontSize: 13,
    color: colors.bodyText,
  },
  undoButton: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  undoButtonText: {
    color: colors.lightGray,
    fontWeight: "600",
    fontSize: 13,
  },
});

function restoreItem<T extends { id: number }>(items: T[], item: T, index: number) {
  if (items.some((entry) => entry.id === item.id)) return items;

  const nextItems = [...items];
  nextItems.splice(Math.max(0, Math.min(index, nextItems.length)), 0, item);
  return nextItems;
}
