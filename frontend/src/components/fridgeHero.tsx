import { useEffect, useMemo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { colors } from "@/themes/colors";
import { fontFamily, fontSizes, fontWeights } from "@/themes/fonts";

type HeroIngredient = {
  label: string;
  shelf: 0 | 1 | 2;
  startX: number;
  drift: number;
  delay: number;
};

type FridgeHeroProps = {
  title: string;
  subtitle: string;
  caption?: string;
};

const heroIngredients: HeroIngredient[] = [
  { label: "Milk", shelf: 0, startX: -10, drift: 20, delay: 120 },
  { label: "Eggs", shelf: 0, startX: 80, drift: -18, delay: 450 },
  { label: "Cheese", shelf: 1, startX: 16, drift: 22, delay: 220 },
  { label: "Spinach", shelf: 1, startX: 110, drift: -24, delay: 560 },
  { label: "Yogurt", shelf: 2, startX: 10, drift: 18, delay: 300 },
  { label: "Berries", shelf: 2, startX: 104, drift: -20, delay: 640 },
];

export default function FridgeHero({ title, subtitle, caption }: FridgeHeroProps) {
  const shelfOpacity = useMemo(() => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)], []);
  const shelfOffset = useMemo(() => [new Animated.Value(20), new Animated.Value(20), new Animated.Value(20)], []);
  const ingredientAnim = useMemo(
    () =>
      heroIngredients.map(() => ({
        x: new Animated.Value(0),
        opacity: new Animated.Value(0.6),
      })),
    [],
  );

  useEffect(() => {
    const shelfTransitions = shelfOpacity.map((opacity, index) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 420,
          delay: 120 + index * 170,
          useNativeDriver: true,
        }),
        Animated.timing(shelfOffset[index], {
          toValue: 0,
          duration: 420,
          delay: 120 + index * 170,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.stagger(130, shelfTransitions).start();

    const ingredientLoops = ingredientAnim.map(({ x, opacity }, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(heroIngredients[index].delay),
          Animated.parallel([
            Animated.timing(x, {
              toValue: heroIngredients[index].drift,
              duration: 2700,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 1400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(x, {
              toValue: 0,
              duration: 2400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.65,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ),
    );

    ingredientLoops.forEach((loop) => loop.start());

    return () => {
      ingredientLoops.forEach((loop) => loop.stop());
    };
  }, [ingredientAnim, shelfOffset, shelfOpacity]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.textSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      </View>

      <View style={styles.fridgeFrame}>
        {[0, 1, 2].map((shelf) => (
          <Animated.View
            key={`shelf-${shelf}`}
            style={[
              styles.shelfRow,
              {
                opacity: shelfOpacity[shelf],
                transform: [{ translateY: shelfOffset[shelf] }],
              },
            ]}
          >
            <View style={styles.shelfLine} />
          </Animated.View>
        ))}

        {heroIngredients.map((ingredient, index) => (
          <Animated.View
            key={ingredient.label}
            style={[
              styles.ingredientTag,
              {
                top: 20 + ingredient.shelf * 58,
                left: ingredient.startX + 30,
                opacity: ingredientAnim[index].opacity,
                transform: [{ translateX: ingredientAnim[index].x }],
              },
            ]}
          >
            <Text style={styles.ingredientText}>{ingredient.label}</Text>
          </Animated.View>
        ))}

        <View style={styles.crisperLeft} />
        <View style={styles.crisperRight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "#132B3B",
    borderWidth: 1,
    borderColor: "#335161",
    overflow: "hidden",
    gap: 16,
  },
  textSection: {
    gap: 6,
  },
  title: {
    color: "#E8F5FF",
    fontSize: fontSizes.header,
    fontFamily: fontFamily.header,
    fontWeight: fontWeights.bold,
  },
  subtitle: {
    color: "#CBE2F0",
    fontSize: fontSizes.subtitle,
    fontFamily: fontFamily.body,
    fontWeight: fontWeights.medium,
  },
  caption: {
    color: "#9AB8CA",
    fontSize: fontSizes.body,
    fontFamily: fontFamily.body,
  },
  fridgeFrame: {
    height: 212,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#5D7B8B",
    backgroundColor: "#0E2230",
    position: "relative",
    overflow: "hidden",
  },
  shelfRow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 62,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
  shelfLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#527287",
  },
  ingredientTag: {
    position: "absolute",
    backgroundColor: "#1A4E66",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#6CA9C8",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ingredientText: {
    color: colors.white,
    fontSize: fontSizes.body,
    fontFamily: fontFamily.body,
    fontWeight: fontWeights.medium,
  },
  crisperLeft: {
    position: "absolute",
    left: 16,
    bottom: 12,
    width: "42%",
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#47697F",
    backgroundColor: "#133346",
  },
  crisperRight: {
    position: "absolute",
    right: 16,
    bottom: 12,
    width: "42%",
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#47697F",
    backgroundColor: "#133346",
  },
});
