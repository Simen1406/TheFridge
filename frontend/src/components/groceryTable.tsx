import { Text, View } from "react-native";
import { GroceryItem } from "@/types/foodTypes";
import InventoryTable, { StatusChip, inventoryTableStyles } from "@/components/inventoryTable";

export default function GroceryTable({
  items,
  onAddPress,
  onRemovePress,
}: {
  items: GroceryItem[];
  onAddPress: () => void;
  onRemovePress: (itemId: number) => void;
}) {
  return (
    <InventoryTable
      title="Grocery List"
      subtitle="Plan your next shopping run"
      items={items}
      addLabel="Add grocery item"
      onAddPress={onAddPress}
      onRemovePress={onRemovePress}
      searchPlaceholder="Search grocery items..."
      searchableText={(item) => `${item.name} ${item.brand} ${item.ean}`}
      columns={[
        {
          key: "name",
          header: "Name",
          width: 220,
          render: (item) => (
            <View>
              <Text style={inventoryTableStyles.primaryText}>{item.name}</Text>
              <Text style={inventoryTableStyles.secondaryText}>{item.brand || "Unknown brand"}</Text>
            </View>
          ),
        },
        {
          key: "quantity",
          header: "Quantity",
          width: 130,
          render: (item) => (
            <Text style={inventoryTableStyles.primaryText}>
              {item.weight} {item.weight_unit}
            </Text>
          ),
        },
        {
          key: "price",
          header: "Price",
          width: 120,
          align: "right",
          render: (item) => (
            <Text style={inventoryTableStyles.primaryText}>{item.price.toFixed(2)} kr</Text>
          ),
        },
        {
          key: "status",
          header: "Status",
          width: 130,
          align: "center",
          render: (item) => {
            const state = getPriceState(item.price);
            return <StatusChip label={state.label} tone={state.tone} />;
          },
        },
      ]}
    />
  );
}

function getPriceState(price: number): {
  label: string;
  tone: "ok" | "warn" | "danger" | "neutral";
} {
  if (price <= 30) return { label: "Budget", tone: "ok" };
  if (price <= 70) return { label: "Regular", tone: "warn" };
  return { label: "High", tone: "danger" };
}
