import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FridgeItem } from "@/types/foodTypes";
import { colors } from "@/themes/colors";
import { fontFamily, fontSizes, fontWeights } from "@/themes/fonts";

const commonFridgeItems: FridgeItem[] = [
  {
    id: 1,
    ean: "100000000001",
    name: "Milk",
    brand: "Tine",
    price: 29.9,
    weight: 1,
    weight_unit: "L",
    image: "",
    expiration_date: "2026-03-14",
  },
  {
    id: 2,
    ean: "100000000002",
    name: "Eggs",
    brand: "Prior",
    price: 44.9,
    weight: 12,
    weight_unit: "pcs",
    image: "",
    expiration_date: "2026-03-20",
  },
  {
    id: 3,
    ean: "100000000003",
    name: "Butter",
    brand: "Bremykt",
    price: 39.9,
    weight: 500,
    weight_unit: "g",
    image: "",
    expiration_date: "2026-04-01",
  },
  {
    id: 4,
    ean: "100000000004",
    name: "Yogurt",
    brand: "Q",
    price: 24.9,
    weight: 500,
    weight_unit: "g",
    image: "",
    expiration_date: "2026-03-18",
  },
  {
    id: 5,
    ean: "100000000005",
    name: "Cheese",
    brand: "Jarlsberg",
    price: 47.9,
    weight: 300,
    weight_unit: "g",
    image: "",
    expiration_date: "2026-03-16",
  },
  {
    id: 6,
    ean: "100000000006",
    name: "Spinach",
    brand: "Bama",
    price: 21.9,
    weight: 200,
    weight_unit: "g",
    image: "",
    expiration_date: "2026-03-13",
  },
  {
    id: 7,
    ean: "100000000007",
    name: "Chicken Breast",
    brand: "Prior",
    price: 84.9,
    weight: 600,
    weight_unit: "g",
    image: "",
    expiration_date: "2026-03-15",
  },
  {
    id: 8,
    ean: "100000000008",
    name: "Heavy Cream",
    brand: "Tine",
    price: 34.9,
    weight: 300,
    weight_unit: "ml",
    image: "",
    expiration_date: "2026-03-22",
  },
];

type FilterKey = "all" | "expiring" | "dairy";

const filterPills: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Items" },
  { key: "expiring", label: "Expiring Soon" },
  { key: "dairy", label: "Dairy Staples" },
];

export default function CommonFridgeItemsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredItems = useMemo(() => {
    if (activeFilter === "expiring") {
      return commonFridgeItems.filter((item) => daysUntil(item.expiration_date) <= 2);
    }

    if (activeFilter === "dairy") {
      return commonFridgeItems.filter((item) => {
        const normalized = `${item.name} ${item.brand}`.toLowerCase();
        return (
          normalized.includes("milk") ||
          normalized.includes("yogurt") ||
          normalized.includes("butter") ||
          normalized.includes("cheese") ||
          normalized.includes("cream")
        );
      });
    }

    return commonFridgeItems;
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {filterPills.map((pill) => (
            <TouchableOpacity
              key={pill.key}
              style={[styles.filterPill, activeFilter === pill.key && styles.filterPillActive]}
              onPress={() => setActiveFilter(pill.key)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === pill.key && styles.filterPillTextActive,
                ]}
              >
                {pill.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          {filteredItems.map((item) => {
            const status = getStatus(item.expiration_date);
            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusChip,
                      status.tone === "fresh" && styles.statusFresh,
                      status.tone === "soon" && styles.statusSoon,
                      status.tone === "expired" && styles.statusExpired,
                    ]}
                  >
                    <Text style={styles.statusText}>{status.label}</Text>
                  </View>
                </View>

                <View style={styles.itemMetaRow}>
                  <Text style={styles.metaText}>
                    Quantity: {item.weight} {item.weight_unit}
                  </Text>
                  <Text style={styles.metaText}>Price: ${item.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.expiryText}>
                  Expires: {formatDate(item.expiration_date)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionTitle}>Smart Suggestions</Text>
          <Text style={styles.suggestionItem}>- Use spinach + eggs for a quick omelet tonight.</Text>
          <Text style={styles.suggestionItem}>
            - Restock milk and yogurt this weekend to keep baseline inventory stable.
          </Text>
          <Text style={styles.suggestionItem}>
            - Batch-cook chicken and save 2 ready meals for busy weekdays.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function daysUntil(value: string | null) {
  if (!value) return Number.POSITIVE_INFINITY;
  const current = new Date();
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return Number.POSITIVE_INFINITY;
  return Math.ceil((target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatus(value: string | null): { label: string; tone: "fresh" | "soon" | "expired" } {
  const remainingDays = daysUntil(value);
  if (remainingDays < 0) return { label: "Expired", tone: "expired" };
  if (remainingDays <= 2) return { label: "Soon", tone: "soon" };
  return { label: "Fresh", tone: "fresh" };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 14,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "rgba(211, 211, 211, 0.25)",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.primary,
  },
  filterPillTextActive: {
    color: colors.lightGray,
    fontWeight: fontWeights.medium,
  },
  section: {
    gap: 10,
  },
  itemCard: {
    borderRadius: 12,
    backgroundColor: "rgba(211, 211, 211, 0.34)",
    borderWidth: 1,
    borderColor: "rgba(6, 30, 41, 0.25)",
    padding: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  itemName: {
    fontFamily: fontFamily.header,
    fontSize: fontSizes.subtitle,
    color: colors.headerText,
  },
  itemBrand: {
    marginTop: 2,
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
    opacity: 0.8,
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusFresh: {
    backgroundColor: "rgba(67, 87, 46, 0.2)",
  },
  statusSoon: {
    backgroundColor: "rgba(139, 98, 18, 0.26)",
  },
  statusExpired: {
    backgroundColor: "rgba(97, 28, 36, 0.24)",
  },
  statusText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    fontWeight: fontWeights.medium,
    color: colors.headerText,
  },
  itemMetaRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metaText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
  },
  expiryText: {
    marginTop: 6,
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    color: colors.darkGray,
  },
  suggestionBox: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "rgba(53, 78, 86, 0.2)",
  },
  suggestionTitle: {
    fontFamily: fontFamily.header,
    fontSize: fontSizes.subtitle,
    color: colors.headerText,
    marginBottom: 8,
  },
  suggestionItem: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    color: colors.bodyText,
    marginBottom: 6,
  },
});
