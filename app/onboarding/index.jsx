import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppTheme } from "../../context/ThemeContext";
import { useOnboarding } from "../../context/OnboardingContext";

const { width } = Dimensions.get("window");

const pages = [
  {
    id: 0,
    icon: "flash-sharp",
    title: "Efficiency\nRedefined.",
    description:
      "Your daily workflow, consolidated into one powerful, high-performance toolkit.",
  },
  {
    id: 1,
    icon: "repeat-sharp",
    title: "Precision\nConversion.",
    description:
      "Live currency rates and technical unit conversions with zero latency.",
  },
  {
    id: 2,
    icon: "qr-code-sharp",
    title: "Seamless\nScanning.",
    description:
      "Generate and scan high-fidelity QR codes instantly for fast data sharing.",
  },
];

const Onboarding = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useOnboarding();

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (currentIndex < pages.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      try {
        await completeOnboarding();
        router.replace("/(tabs)");
      } catch (e) {
        console.error("Failed to complete onboarding", e);
      }
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.textPrimary }]}>
          OMNIKIT
        </Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skip, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {pages.map((page) => (
          <View key={page.id} style={[styles.page, { width }]}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons name={page.icon} size={64} color={colors.primary} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {page.title}
              </Text>
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
              >
                {page.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 20) }]}>
        <View style={styles.indicatorContainer}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    i === currentIndex ? colors.primary : colors.elevated,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.cta, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.ctaText}>
            {currentIndex === pages.length - 1 ? "Enter Workspace" : "Continue"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 20,
    alignItems: "center",
  },
  brand: { fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  skip: { fontSize: 14, fontWeight: "600" },
  page: { paddingHorizontal: 40, justifyContent: "center" },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  textWrapper: { width: "100%" },
  title: {
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 52,
    letterSpacing: -1,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  indicatorContainer: { flexDirection: "row", gap: 6 },
  indicator: { height: 6, borderRadius: 3 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 10,
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "700" },
});

export default Onboarding;
