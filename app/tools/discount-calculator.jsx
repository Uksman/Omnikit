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
import { ChevronLeft, Tag } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { calculateDiscountInfo } from "../../utils/calculators";
import { formatDecimal } from "../../utils/formatters";

export default function DiscountCalculator() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [result, setResult] = useState({ final: 0, saved: 0 });

  const calculateDiscount = useCallback(() => {
    const result = calculateDiscountInfo(price, discount, tax);
    setResult(result);
  }, [price, discount, tax]);

  useEffect(() => {
    calculateDiscount();
  }, [calculateDiscount]);

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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Discount Calc</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Results Card */}
        <View style={[styles.resultCard, { backgroundColor: "#10B981" }]}>
          <Text style={styles.resultLabel}>Final Price</Text>
          <Text style={styles.resultValue}>${result.final}</Text>
          
          <View style={styles.resultRow}>
            <View>
              <Text style={styles.subLabel}>You Save</Text>
              <Text style={styles.subValue}>${result.saved}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.subLabel}>Original</Text>
              <Text style={styles.subValue}>${formatDecimal(price || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>ORIGINAL PRICE</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <Text style={{ color: colors.textMuted, fontSize: 18, fontWeight: "700" }}>$</Text>
              <TextInput
                placeholder="100.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={[styles.textInput, { color: colors.textPrimary }]}
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DISCOUNT %</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                 <TextInput
                  placeholder="20"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={discount}
                  onChangeText={setDiscount}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>TAX % (OPTIONAL)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  placeholder="8"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={tax}
                  onChangeText={setTax}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoTitleRow}>
            <Tag size={18} color="#10B981" />
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>Shopping Strategy</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            Always calculate the total after tax to see the real cost. Discounts are applied to the base price before tax is added.
          </Text>
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
  resultCard: { padding: 32, borderRadius: 32, marginBottom: 32 },
  resultLabel: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  resultValue: { color: "white", fontSize: 44, fontWeight: "900", marginVertical: 8 },
  resultRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" },
  subLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  subValue: { color: "white", fontSize: 18, fontWeight: "800", marginTop: 4 },
  inputSection: { gap: 24, marginBottom: 32 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  inputWrapper: { flexDirection: "row", alignItems: "center", height: 60, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, gap: 10 },
  textInput: { flex: 1, fontSize: 18, fontWeight: "700" },
  row: { flexDirection: "row", gap: 16 },
  infoBox: { padding: 24, borderRadius: 28, borderWidth: 1, gap: 12 },
  infoTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoTitle: { fontSize: 15, fontWeight: "800" },
  infoText: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
});
