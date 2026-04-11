import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Info, Activity } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { calculateBMIScore } from "../../utils/calculators";

export default function BMICalculator() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [classification, setClassification] = useState(null);

  const calculateBMI = useCallback(() => {
    const result = calculateBMIScore(weight, height);
    if (result) {
      setBmi(result.score);
      setClassification({ label: result.label, color: result.color });
    } else {
      setBmi(null);
      setClassification(null);
    }
  }, [weight, height]);

  useEffect(() => {
    calculateBMI();
  }, [calculateBMI]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>BMI Calculator</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Results Display */}
        <View style={[styles.resultCard, { backgroundColor: classification ? classification.color : colors.surface, borderColor: colors.border }]}>
          {bmi ? (
            <View style={styles.resultValueWrapper}>
              <Text style={styles.resultLabel}>Your BMI</Text>
              <Text style={styles.resultValue}>{bmi}</Text>
              <View style={styles.classificationBadge}>
                <Text style={styles.classificationText}>{classification.label}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyResult}>
              <Activity size={60} color={colors.textMuted} strokeWidth={1} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Enter your details below to calculate your BMI
              </Text>
            </View>
          )}
        </View>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>WEIGHT (KG)</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                placeholder="e.g. 70"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={[styles.textInput, { color: colors.textPrimary }]}
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>HEIGHT (CM)</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                placeholder="e.g. 175"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={[styles.textInput, { color: colors.textPrimary }]}
                value={height}
                onChangeText={setHeight}
              />
            </View>
          </View>
        </View>

        {/* Range Reference */}
        <View style={[styles.referenceBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.refHeader}>
            <Info size={16} color={colors.primary} />
            <Text style={[styles.refTitle, { color: colors.textPrimary }]}>BMI Reference</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={[styles.refLabel, { color: colors.textMuted }]}>Underweight</Text>
            <Text style={[styles.refValue, { color: "#3B82F6" }]}>&lt; 18.5</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={[styles.refLabel, { color: colors.textMuted }]}>Normal</Text>
            <Text style={[styles.refValue, { color: "#10B981" }]}>18.5 - 24.9</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={[styles.refLabel, { color: colors.textMuted }]}>Overweight</Text>
            <Text style={[styles.refValue, { color: "#F59E0B" }]}>25 - 29.9</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={[styles.refLabel, { color: colors.textMuted }]}>Obese</Text>
            <Text style={[styles.refValue, { color: "#EF4444" }]}>&gt; 30</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: { padding: 24 },
  resultCard: {
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  resultValueWrapper: { alignItems: "center", gap: 4 },
  resultLabel: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "700", textTransform: "uppercase" },
  resultValue: { color: "white", fontSize: 64, fontWeight: "900" },
  classificationBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  classificationText: { color: "white", fontSize: 14, fontWeight: "800" },
  emptyResult: { alignItems: "center", gap: 16, paddingHorizontal: 20 },
  emptyText: { textAlign: "center", fontSize: 14, fontWeight: "600", lineHeight: 20 },
  inputSection: { gap: 20, marginBottom: 32 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  textInput: { flex: 1, fontSize: 18, fontWeight: "700" },
  referenceBox: { padding: 24, borderRadius: 28, borderWidth: 1, gap: 12 },
  refHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  refTitle: { fontSize: 14, fontWeight: "800" },
  refRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  refLabel: { fontSize: 13, fontWeight: "600" },
  refValue: { fontSize: 13, fontWeight: "800" },
});
