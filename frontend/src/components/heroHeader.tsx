import { useEffect, useMemo } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { colors } from "@/themes/colors";
import { fontFamily, fontSizes, fontWeights } from "@/themes/fonts";

export type HeroStat = {
  label: string;
  value: string;
};

type HeroAction = {
  label: string;
  onPress?: () => void;
};

type HeroHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  caption?: string;
  stats?: HeroStat[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  previewTitle?: string;
  previewItems?: string[];
};

const defaultPreviewItems = ["Inventory synced", "2 items expiring soon", "List ready for checkout"];

export default function HeroHeader({
  eyebrow,
  title,
  subtitle,
  caption,
  stats = [],
  primaryAction,
  secondaryAction,
  previewTitle = "Smart fridge pulse",
  previewItems = defaultPreviewItems,
}: HeroHeaderProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 760;

  const contentAnim = useMemo(
    () => ({
      opacity: new Animated.Value(0),
      y: new Animated.Value(18),
    }),
    [],
  );
  const previewAnim = useMemo(
    () => ({
      opacity: new Animated.Value(0),
      y: new Animated.Value(24),
    }),
    [],
  );
  const chipAnimations = useMemo(
    () =>
      previewItems.map((_, index) => ({
        x: new Animated.Value(index % 2 === 0 ? -8 : 8),
        opacity: new Animated.Value(0.65),
      })),
    [previewItems],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentAnim.opacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim.y, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(previewAnim.opacity, {
        toValue: 1,
        duration: 380,
        delay: 90,
        useNativeDriver: true,
      }),
      Animated.timing(previewAnim.y, {
        toValue: 0,
        duration: 420,
        delay: 90,
        useNativeDriver: true,
      }),
    ]).start();

    const loops = chipAnimations.map(({ x, opacity }, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(x, {
              toValue: index % 2 === 0 ? 8 : -8,
              duration: 1800 + index * 250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(x, {
              toValue: index % 2 === 0 ? -8 : 8,
              duration: 1800 + index * 250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.7,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ),
    );

    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [chipAnimations, contentAnim, previewAnim]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={[styles.layoutRow, isCompact && styles.layoutColumn]}>
        <Animated.View
          style={[
            styles.contentArea,
            {
              opacity: contentAnim.opacity,
              transform: [{ translateY: contentAnim.y }],
            },
          ]}
        >
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {caption ? <Text style={styles.caption}>{caption}</Text> : null}

          {(primaryAction || secondaryAction) && (
            <View style={styles.actionRow}>
              {primaryAction ? (
                <Pressable style={[styles.actionButton, styles.primaryAction]} onPress={primaryAction.onPress}>
                  <Text style={[styles.actionText, styles.primaryActionText]}>{primaryAction.label}</Text>
                </Pressable>
              ) : null}
              {secondaryAction ? (
                <Pressable
                  style={[styles.actionButton, styles.secondaryAction]}
                  onPress={secondaryAction.onPress}
                >
                  <Text style={[styles.actionText, styles.secondaryActionText]}>{secondaryAction.label}</Text>
                </Pressable>
              ) : null}
            </View>
          )}

          {stats.length > 0 ? (
            <View style={styles.statsRow}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.statCard}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Animated.View>

        <Animated.View
          style={[
            styles.previewArea,
            isCompact && styles.previewCompact,
            {
              opacity: previewAnim.opacity,
              transform: [{ translateY: previewAnim.y }],
            },
          ]}
        >
          <Text style={styles.previewTitle}>{previewTitle}</Text>
          {previewItems.map((item, index) => (
            <Animated.View
              key={`${item}-${index}`}
              style={[
                styles.previewChip,
                {
                  opacity: chipAnimations[index]?.opacity ?? 1,
                  transform: [{ translateX: chipAnimations[index]?.x ?? 0 }],
                },
              ]}
            >
              <View style={styles.previewChipDot} />
              <Text style={styles.previewChipText}>{item}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: colors.container,
    padding: 18,
    overflow: "hidden",
    position: "relative",
  },
  glowTop: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -120,
    right: -80,
    backgroundColor: "rgba(139, 98, 18, 0.35)",
  },
  glowBottom: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 999,
    bottom: -130,
    left: -90,
    backgroundColor: "rgba(67, 87, 46, 0.26)",
  },
  layoutRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 14,
  },
  layoutColumn: {
    flexDirection: "column",
  },
  contentArea: {
    flex: 1.25,
    gap: 8,
  },
  eyebrow: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    color: "rgba(255,255,255,0.82)",
  },
  title: {
    color: colors.white,
    fontSize: fontSizes.header + 2,
    fontFamily: fontFamily.header,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.header + 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSizes.subtitle - 1,
    fontFamily: fontFamily.body,
    fontWeight: fontWeights.medium,
  },
  caption: {
    marginTop: 2,
    color: "rgba(255,255,255,0.72)",
    fontSize: fontSizes.body,
    fontFamily: fontFamily.body,
  },
  actionRow: {
    marginTop: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  primaryAction: {
    backgroundColor: colors.background,
    borderColor: "rgba(255,255,255,0.32)",
  },
  secondaryAction: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  actionText: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
  },
  primaryActionText: {
    color: colors.white,
  },
  secondaryActionText: {
    color: "rgba(255,255,255,0.92)",
  },
  statsRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    minWidth: 92,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  statValue: {
    color: colors.white,
    fontFamily: fontFamily.header,
    fontSize: fontSizes.subtitle - 1,
    fontWeight: fontWeights.bold,
  },
  statLabel: {
    marginTop: 2,
    color: "rgba(255,255,255,0.8)",
    fontFamily: fontFamily.body,
    fontSize: fontSizes.small + 2,
  },
  previewArea: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(53, 78, 86, 0.55)",
    padding: 12,
    justifyContent: "center",
    gap: 8,
    minHeight: 178,
  },
  previewCompact: {
    minHeight: 0,
  },
  previewTitle: {
    color: colors.white,
    fontFamily: fontFamily.header,
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.bold,
    marginBottom: 4,
  },
  previewChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.26)",
    backgroundColor: "rgba(15, 33, 67, 0.7)",
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  previewChipDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  previewChipText: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: fontFamily.body,
    fontSize: fontSizes.body,
    flex: 1,
  },
});
