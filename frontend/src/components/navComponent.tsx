import { useEffect, useMemo } from "react";
import { Animated, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Link } from "expo-router";
import { usePathname } from "expo-router";

import { fontSizes, fontFamily, fontWeights, } from "@/themes/fonts";
import { colors } from "@/themes/colors";

// navigation menu for all pages

export default function SharedNav() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isCompact = width < 860;
  const bgDriftX = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bgDriftX, {
          toValue: -14,
          duration: 4200,
          useNativeDriver: true,
        }),
        Animated.timing(bgDriftX, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bgDriftX]);

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      <Animated.Image
        source={require("../assets/menuHeader.jpg")}
        resizeMode="stretch"
        style={[
          styles.backgroundImage,
          isCompact && styles.backgroundImageCompact,
          { transform: [{ translateX: bgDriftX }] },
        ]}
      />
      <View style={styles.imageTint} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.contentWrap}>
        <View style={styles.navHeader}>
          <Text style={styles.navTitle}>The Fridge</Text>
          <Text style={styles.navSubtitle}>Track groceries, cut waste, cook smarter</Text>
        </View>

        <View style={styles.navLinks}>
          <NavChip href="/(tabs)" label="Home" active={pathname === "/"} />
          <NavChip href="/(tabs)/Fridge" label="My Fridge" active={pathname === "/Fridge"} />
          <NavChip href="/(tabs)/Groceries" label="Grocery List" active={pathname === "/Groceries"} />
          <NavChip
            href="/(tabs)/CommonFridgeItems"
            label="Common Items"
            active={pathname === "/CommonFridgeItems"}
          />
        </View>
      </View>
    </View>
  );
}

type NavChipProps = {
  href: "/(tabs)" | "/(tabs)/Fridge" | "/(tabs)/Groceries" | "/(tabs)/CommonFridgeItems";
  label: string;
  active: boolean;
};

function NavChip({ href, label, active }: NavChipProps) {
  return (
    <Link href={href} style={[styles.navLink, active && styles.navLinkActive]}>
      <Text style={[styles.linkText, active && styles.linkTextActive]}>{label}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    minHeight: 190,
    justifyContent: "center",
    paddingVertical: 75,
    paddingHorizontal: 22,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.18)",
    position: "relative",
  },
  containerCompact: {
    minHeight: 220,
    paddingHorizontal: 16,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "112%",
    height: "100%",
    left: "-6%",
    opacity: 0.48,
  },
  backgroundImageCompact: {
    opacity: 0.35,
  },
  imageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 32, 43, 0.55)",
  },
  glowTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    right: -140,
    top: -145,
    backgroundColor: "rgba(139, 98, 18, 0.28)",
  },
  glowBottom: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    left: -200,
    bottom: -200,
    backgroundColor: "rgba(67, 87, 46, 0.23)",
  },
  contentWrap: {
    gap: 15,
    zIndex: 2,
  },
  navHeader: {
    gap: 10,
  },
  navTitle: {
    color: colors.white,
    fontSize: fontSizes.header - 2,
    fontFamily: fontFamily.navFont,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  navSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: fontSizes.body + 1,
    fontFamily: fontFamily.body,
  },
  navLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  navLink: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(6, 30, 41, 0.4)",
  },
  navLinkActive: {
    backgroundColor: colors.background,
    borderColor: "rgba(255,255,255,0.5)",
  },
  linkText: {
    color: colors.lightGray,
    fontSize: fontSizes.navText - 1,
    fontFamily: fontFamily.body,
    fontWeight: fontWeights.medium,
  },
  linkTextActive: {
    color: colors.white,
  },
});
