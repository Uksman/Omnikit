import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Droplets, Plus, RotateCcw, Settings } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { useWaterStore } from "../../store/useWaterStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function WaterTracker() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { intake, goal, addIntake, resetIntake } = useWaterStore();

  const progress = Math.min(intake / goal, 1);
  const percentage = Math.round(progress * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Water Tracker</Text>
        <TouchableOpacity style={styles.settingsBtn}>
           <Settings size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Display */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressCircleBack, { borderColor: colors.surface }]}>
            <View style={styles.progressTextWrapper}>
              <Text style={[styles.percentageText, { color: colors.textPrimary }]}>{percentage}%</Text>
              <Text style={[styles.goalText, { color: colors.textMuted }]}>{intake} / {goal} ml</Text>
            </View>
            <Droplets size={40} color={colors.primary} style={styles.dropletIcon} />
          </View>
          
          <View style={[styles.waveContainer, { backgroundColor: colors.surface }]}>
            <View 
              style={[
                styles.waveFill, 
                { 
                  backgroundColor: colors.primary, 
                  height: `${progress * 100}%`,
                  opacity: 0.8
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.actionSection}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>QUICK ADD</Text>
          <View style={styles.quickAddGrid}>
            {[250, 500, 750].map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => addIntake(amount)}
                style={[styles.quickAddBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Plus size={16} color={colors.primary} />
                <Text style={[styles.quickAddText, { color: colors.textPrimary }]}>{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.mainActionRow}>
          <TouchableOpacity 
            onPress={() => addIntake(100)}
            style={[styles.mainAddBtn, { backgroundColor: colors.primary }]}
          >
            <Plus size={24} color="white" />
            <Text style={styles.mainAddBtnText}>Add 100ml</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={resetIntake}
            style={[styles.resetBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <RotateCcw size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            Daily Tip: Drinking water helps maintain the balance of body fluids, boosts energy, and improves skin health.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  settingsBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  scrollContent: { padding: 24, alignItems: "center" },
  progressContainer: {
    width: SCREEN_WIDTH * 0.7,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  progressCircleBack: {
    width: "100%",
    height: "100%",
    borderRadius: SCREEN_WIDTH * 0.35,
    borderWidth: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressTextWrapper: { alignItems: "center", gap: 4 },
  percentageText: { fontSize: 48, fontWeight: "900" },
  goalText: { fontSize: 14, fontWeight: "700" },
  dropletIcon: { position: "absolute", bottom: 20 },
  waveContainer: {
    position: "absolute",
    width: "80%",
    height: "80%",
    borderRadius: 1000,
    overflow: "hidden",
    zIndex: -1,
  },
  waveFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  actionSection: { width: "100%", marginTop: 20 },
  label: { fontSize: 11, fontWeight: "900", letterSpacing: 1, marginBottom: 16 },
  quickAddGrid: { flexDirection: "row", gap: 12 },
  quickAddBtn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
  quickAddText: { fontSize: 14, fontWeight: "700" },
  mainActionRow: { flexDirection: "row", width: "100%", marginTop: 24, gap: 12 },
  mainAddBtn: {
    flex: 1,
    height: 64,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  mainAddBtnText: { color: "white", fontSize: 18, fontWeight: "700" },
  resetBtn: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: { marginTop: 40, paddingHorizontal: 20 },
  infoText: { fontSize: 13, lineHeight: 18, textAlign: "center", fontStyle: "italic" },
});
