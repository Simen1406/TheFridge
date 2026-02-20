import { Text, View, StyleSheet, Button } from "react-native";
import { fontSizes, fontFamily, fontWeights } from "@/themes/fonts";
import { colors } from "@/themes/colors";
import { mockGroceryItems } from "@/data/groceryList";
import GroceryTable from "@/components/groceryTable";

export default function GroceryList() {
  return (
    // grocery list screen - shows items to buy.
    <View style={styles.container}>
      <GroceryTable items= {mockGroceryItems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  title: {
    paddingBottom: 20,
    fontSize: fontSizes.header,
    fontWeight: fontWeights.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSizes.subtitle,
    color: colors.headerText,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    color: colors.lightGray,
    fontSize: fontSizes.body,
    fontFamily: fontFamily.body,
  },
});
