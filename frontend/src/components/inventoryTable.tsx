import { ReactNode, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/themes/colors";
import { fontFamily, fontSizes, fontWeights } from "@/themes/fonts";

type CellAlign = "left" | "center" | "right";

type TableColumn<T> = {
  key: string;
  header: string;
  width?: number;
  align?: CellAlign;
  render: (item: T) => ReactNode;
};

type InventoryTableProps<T extends { id: number }> = {
  title: string;
  subtitle: string;
  items: T[];
  columns: TableColumn<T>[];
  onAddPress: () => void;
  onRemovePress: (itemId: number) => void;
  addLabel?: string;
  searchPlaceholder?: string;
  searchableText?: (item: T) => string;
  emptyMessage?: string;
};

function chipBackground(status: "ok" | "warn" | "danger" | "neutral") {
  if (status === "ok") return "rgba(67, 87, 46, 0.18)";
  if (status === "warn") return "rgba(139, 98, 18, 0.22)";
  if (status === "danger") return "rgba(97, 28, 36, 0.24)";
  return "rgba(53, 78, 86, 0.2)";
}

function chipText(status: "ok" | "warn" | "danger" | "neutral") {
  if (status === "ok") return colors.secondary;
  if (status === "warn") return colors.primary;
  if (status === "danger") return "#611C24";
  return colors.headerText;
}

export function StatusChip({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "ok" | "warn" | "danger" | "neutral";
}) {
  return (
    <View style={[styles.statusChip, { backgroundColor: chipBackground(tone) }]}>
      <Text style={[styles.statusText, { color: chipText(tone) }]}>{label}</Text>
    </View>
  );
}

export default function InventoryTable<T extends { id: number }>({
  title,
  subtitle,
  items,
  columns,
  onAddPress,
  onRemovePress,
  addLabel = "Add item",
  searchPlaceholder = "Search items...",
  searchableText,
  emptyMessage = "No items found.",
}: InventoryTableProps<T>) {
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalized) return items;

    return items.filter((item) => {
      const value = searchableText ? searchableText(item) : JSON.stringify(item);
      return value.toLowerCase().includes(normalized);
    });
  }, [items, normalized, searchableText]);

  return (
    <View style={styles.screenWrap}>
      <View style={styles.card}>
        <View style={styles.headerArea}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>V</Text>
          </TouchableOpacity>

          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>S</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.gray}
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ {addLabel}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.indexCol]}>#</Text>
              {columns.map((column) => (
                <Text
                  key={column.key}
                  style={[
                    styles.headerCell,
                    {
                      width: column.width ?? 150,
                      textAlign: column.align ?? "left",
                    },
                  ]}
                >
                  {column.header}
                </Text>
              ))}
              <Text style={[styles.headerCell, styles.actionCol]}>ACTION</Text>
            </View>

            {filteredItems.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            ) : (
              filteredItems.map((item, index) => (
                <View
                  key={item.id}
                  style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                >
                  <Text style={[styles.indexCell, styles.indexCol]}>{index + 1}</Text>

                  {columns.map((column) => (
                    <View
                      key={`${item.id}-${column.key}`}
                      style={{ width: column.width ?? 150, alignItems: alignToItems(column.align) }}
                    >
                      {column.render(item)}
                    </View>
                  ))}

                  <View style={styles.actionCol}>
                    <TouchableOpacity
                      onPress={() => onRemovePress(item.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function alignToItems(align?: CellAlign) {
  if (align === "center") return "center" as const;
  if (align === "right") return "flex-end" as const;
  return "flex-start" as const;
}

export const inventoryTableStyles = StyleSheet.create({
  primaryText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
  },
  secondaryText: {
    marginTop: 2,
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    color: colors.darkGray,
    opacity: 0.75,
  },
});

const styles = StyleSheet.create({
  screenWrap: {
    flex: 1,
    width: "100%",
  },
  card: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    padding: 14,
  },
  headerArea: {
    marginBottom: 12,
  },
  title: {
    fontFamily: fontFamily.header,
    fontSize: fontSizes.header,
    fontWeight: fontWeights.bold,
    color: colors.headerText,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  filterButton: {
    width: 42,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: fontFamily.body,
  },
  searchWrap: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchIcon: {
    color: colors.primary,
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
  },
  addButton: {
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  addButtonText: {
    color: colors.lightGray,
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(211, 211, 211, 0.75)",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  headerCell: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 1,
    fontWeight: fontWeights.bold,
    color: colors.headerText,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 62,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(53, 78, 86, 0.25)",
  },
  rowEven: {
    backgroundColor: "rgba(211, 211, 211, 0.38)",
  },
  rowOdd: {
    backgroundColor: "rgba(211, 211, 211, 0.24)",
  },
  indexCol: {
    width: 44,
  },
  indexCell: {
    width: 44,
    paddingHorizontal: 8,
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
  },
  actionCol: {
    width: 96,
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
  removeButton: {
    borderRadius: 7,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(97, 28, 36, 0.2)",
  },
  removeButtonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    color: "#611C24",
    fontWeight: fontWeights.medium,
  },
  emptyRow: {
    paddingVertical: 24,
    alignItems: "center",
    backgroundColor: "rgba(211, 211, 211, 0.25)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.primary,
  },
  emptyText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    fontWeight: fontWeights.medium,
  },
});
