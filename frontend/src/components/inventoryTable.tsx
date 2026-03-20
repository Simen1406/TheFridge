import { ReactNode, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
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
  isLoading?: boolean;
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
  isLoading = false,
}: InventoryTableProps<T>) {
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { width } = useWindowDimensions();

  const normalized = query.trim().toLowerCase();
  const hasQuery = normalized.length > 0;
  const isCompact = width < 900;

  const columnWidth = (size?: number) => {
    const base = size ?? 150;
    if (!isCompact) return base;
    return Math.max(110, Math.round(base * 0.82));
  };

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
          <TouchableOpacity
            style={styles.filterButton}
            accessibilityRole="button"
            accessibilityLabel="Table filters"
            accessibilityHint="Filtering will be available in the next phase"
          >
            <Text style={styles.filterIcon}>⚙</Text>
          </TouchableOpacity>

          <View style={[styles.searchWrap, isSearchFocused && styles.searchWrapFocused]}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.gray}
              style={styles.searchInput}
              accessibilityLabel="Search table items"
              accessibilityHint="Filters visible rows as you type"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>

          <TouchableOpacity
            onPress={onAddPress}
            style={styles.addButton}
            accessibilityRole="button"
            accessibilityLabel={addLabel}
            accessibilityHint="Opens the add item form"
          >
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addButtonText}>{addLabel}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { width: isCompact ? 36 : 44 }]}>#</Text>
              {columns.map((column) => (
                <Text
                  key={column.key}
                  style={[
                    styles.headerCell,
                    {
                      width: columnWidth(column.width),
                      textAlign: column.align ?? "left",
                    },
                  ]}
                >
                  {column.header}
                </Text>
              ))}
              <Text style={[styles.headerCell, { width: isCompact ? 88 : 104, textAlign: "right" }]}>
                Action
              </Text>
            </View>

            {isLoading ? (
              <View style={styles.emptyRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.emptyTitle}>Loading items...</Text>
                <Text style={styles.emptySubtext}>Fetching latest table rows.</Text>
              </View>
            ) : filteredItems.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyIcon}>⌕</Text>
                <Text style={styles.emptyTitle}>{hasQuery ? "No results" : emptyMessage}</Text>
                <Text style={styles.emptySubtext}>
                  {hasQuery ? "Try a different name, brand, or EAN." : "Add your first item to populate this table."}
                </Text>
              </View>
            ) : (
              filteredItems.map((item, index) => (
                <View
                  key={item.id}
                  style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                >
                  <Text style={[styles.indexCell, { width: isCompact ? 36 : 44 }]}>{index + 1}</Text>

                  {columns.map((column) => (
                    <View
                      key={`${item.id}-${column.key}`}
                      style={{ width: columnWidth(column.width), alignItems: alignToItems(column.align) }}
                    >
                      {column.render(item)}
                    </View>
                  ))}

                  <View style={[styles.actionCol, { width: isCompact ? 88 : 104 }]}>
                    <TouchableOpacity
                      onPress={() => onRemovePress(item.id)}
                      style={styles.removeButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove row ${index + 1}`}
                      accessibilityHint="Removes this item from the table"
                    >
                      <Text style={styles.removeIcon}>×</Text>
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
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  filterButton: {
    width: 42,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "rgba(211, 211, 211, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    fontFamily: fontFamily.body,
    opacity: 0.9,
  },
  searchWrap: {
    flex: 1,
    minWidth: 190,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "rgba(211, 211, 211, 0.72)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 6,
  },
  searchWrapFocused: {
    borderColor: colors.container,
    shadowColor: colors.container,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  searchIcon: {
    color: colors.primary,
    marginRight: 2,
    fontSize: 16,
    fontWeight: fontWeights.bold,
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
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    gap: 6,
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
  addIcon: {
    color: colors.lightGray,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: fontWeights.bold,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(211, 211, 211, 0.88)",
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
    paddingVertical: 12,
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
    width: 104,
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
  removeButton: {
    borderRadius: 9,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(97, 28, 36, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(97, 28, 36, 0.25)",
  },
  removeButtonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    color: "#611C24",
    fontWeight: fontWeights.medium,
  },
  removeIcon: {
    fontSize: 16,
    lineHeight: 16,
    color: "#611C24",
    fontWeight: fontWeights.bold,
  },
  emptyRow: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 6,
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
  emptyTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body + 1,
    color: colors.bodyText,
    fontWeight: fontWeights.medium,
  },
  emptyIcon: {
    fontSize: 21,
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  emptySubtext: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    color: colors.headerText,
    opacity: 0.8,
  },
  statusChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(6, 30, 41, 0.14)",
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  statusText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    fontWeight: fontWeights.medium,
  },
});
