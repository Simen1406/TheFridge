import { Tabs, Slot } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
  if (Platform.OS === "web") {
    return (
      <Slot />
    );
  }
  
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="fridgeInventory" options={{ title: "Inventory" }} />
      <Tabs.Screen name="gorceryList" options={{ title: "Grocery List" }} />
    </Tabs>
  );
}
