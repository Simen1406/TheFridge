import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="fridgeInventory" options={{ title: "Inventory" }} />
      <Tabs.Screen name="gorceryList" options={{ title: "Grocery List" }} />
    </Tabs>
  );
}
