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
      <Tabs.Screen name="Fridge" options={{ title: "Fridge" }} />
      <Tabs.Screen name="Groceries" options={{ title: "Grocery" }} />
    </Tabs>
  );
}
