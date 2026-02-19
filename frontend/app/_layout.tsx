import {View, StyleSheet} from "react-native";
import { Platform } from "react-native";
import { Stack } from "expo-router";

import SharedNav from "@/components/navComponent";


export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "web" && <SharedNav />}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
