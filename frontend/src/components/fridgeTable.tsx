import { Text, View } from "react-native";
import { FridgeItem } from "@/types/foodTypes";
import InventoryTable, { StatusChip, inventoryTableStyles } from "@/components/inventoryTable";

export default function FridgeTable({
  items,
  onAddPress,
  onRemovePress,
}: {
  items: FridgeItem[];
  onAddPress: () => void;
  onRemovePress: (itemId: number) => void;
}) {
  return (
    <InventoryTable
      title="Fridge Inventory"
      subtitle="Track what you have and what expires soon"
      items={items}
      addLabel="Add fridge item"
      onAddPress={onAddPress}
      onRemovePress={onRemovePress}
      searchPlaceholder="Search fridge items..."
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
          key: "expires",
          header: "Expires",
          width: 140,
          render: (item) => (
            <Text style={inventoryTableStyles.primaryText}>{formatDate(item.expiration_date)}</Text>
          ),
        },
        {
          key: "status",
          header: "Status",
          width: 120,
          align: "center",
          render: (item) => {
            const expiry = getExpiryStatus(item.expiration_date);
            return <StatusChip label={expiry.label} tone={expiry.tone} />;
          },
        },
      ]}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function getExpiryStatus(value: string | null): {
  label: string;
  tone: "ok" | "warn" | "danger" | "neutral";
} {
  if (!value) return { label: "No date", tone: "neutral" };

  const today = new Date();
  const expiry = new Date(value);

  if (Number.isNaN(expiry.getTime())) {
    return { label: "Unknown", tone: "neutral" };
  }

  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { label: "Expired", tone: "danger" };
  if (daysLeft <= 2) return { label: "Soon", tone: "warn" };
  return { label: "Fresh", tone: "ok" };
}
