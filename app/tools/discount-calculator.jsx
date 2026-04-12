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
import { ChevronLeft, Tag, Sparkles } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { calculateDiscountInfo } from "../../utils/calculators";
import { sanitizeNumeric } from "../../utils/formatters";

import { useHistory } from "../../context/HistoryContext";
import { useToast } from "../../context/ToastContext";
import { useCurrencyStore } from "../../store/useCurrencyStore";

export default function DiscountCalculator() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addHistory } = useHistory();
  const { showToast } = useToast();
  const { currency } = useCurrencyStore();

  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [result, setResult] = useState({ final: "0.00", saved: "0.00", taxAmount: "0.00" });

  const handleSave = () => {
    if (parseFloat(result.final) <= 0) return;
    
    addHistory({
      type: 'discount',
      title: `${discount}% Off ${currency.symbol}${price}`,
      subtitle: `Saved ${currency.symbol}${result.saved}`,
      value: `Final: ${currency.symbol}${result.final}`,
      time: "Just now",
    });
    showToast("Saved to Activity!");
  };

  const calculateDiscount = useCallback(() => {
    const res = calculateDiscountInfo(price, discount, tax);
    setResult(res);
  }, [price, discount, tax]);

  useEffect(() => {
    calculateDiscount();
  }, [calculateDiscount]);

  // Logic for the visual bar comparison
  const originalPriceNum = parseFloat(price) || 0;
  const finalPriceNum = parseFloat(result.final) || 0;
  const savingsWidth =
    originalPriceNum > 0 ? (finalPriceNum / originalPriceNum) * 100 : 100;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Discount Finder
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Results Card */}
        <View style={[styles.resultCard, { backgroundColor: "#10B981" }]}>
          <View style={styles.savingsBadge}>
            <Sparkles size={12} color="#10B981" />
            <Text style={styles.savingsBadgeText}>GREAT DEAL</Text>
          </View>

          <Text style={styles.resultLabel}>Final Price</Text>
          <Text style={styles.resultValue}>{currency.symbol}{result.final}</Text>

          {/* Visual Price Comparison Bar */}
          <View style={styles.comparisonContainer}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>
                You pay {Math.round(savingsWidth)}% of original
              </Text>
            </View>
            <View style={styles.fullBar}>
              <View style={[styles.activeBar, { width: `${savingsWidth}%` }]} />
            </View>
          </View>

          <View style={styles.resultRow}>
            <View>
              <Text style={styles.subLabel}>You Save</Text>
              <Text style={styles.subValue}>{currency.symbol}{result.saved}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.subLabel}>Total Tax</Text>
              <Text style={styles.subValue}>
                {currency.symbol}{result.taxAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          style={[
            styles.saveButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: parseFloat(price) > 0 ? 1 : 0.5,
            },
          ]}
          disabled={!(parseFloat(price) > 0)}
        >
          <Tag size={20} color={colors.primary} />
          <Text style={[styles.saveButtonText, { color: colors.textPrimary }]}>Save to Activity</Text>
        </TouchableOpacity>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              STICKER PRICE
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={styles.currencyPrefix}>{currency.symbol}</Text>
              <TextInput
                placeholder="e.g. 99.99"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={[styles.textInput, { color: colors.textPrimary }]}
                value={price}
                onChangeText={(text) => setPrice(sanitizeNumeric(text))}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}>
                DISCOUNT %
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}>
                <TextInput
                  placeholder="20"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={discount}
                  onChangeText={(text) => setDiscount(sanitizeNumeric(text))}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}>
                TAX %
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}>
                <TextInput
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={tax}
                  onChangeText={(text) => setTax(sanitizeNumeric(text))}
                />
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.infoBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <View style={styles.infoTitleRow}>
            <Tag size={18} color="#10B981" />
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
              Smart Shopper Tip
            </Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            This calculator applies the discount first, then calculates tax on
            the discounted price. This is how most retail stores operate!
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

  // Results Card
  resultCard: {
    padding: 28,
    borderRadius: 32,
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 32,
    gap: 10,
    borderWidth: 1,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  savingsBadge: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  savingsBadgeText: { color: "#10B981", fontSize: 10, fontWeight: "900" },
  resultLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  resultValue: { color: "white", fontSize: 48, fontWeight: "900" },

  // Comparison Bar
  comparisonContainer: { marginTop: 16, marginBottom: 8 },
  barLabelRow: { marginBottom: 6 },
  barLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  fullBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  activeBar: { height: "100%", backgroundColor: "white" },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  subLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "700" },
  subValue: { color: "white", fontSize: 18, fontWeight: "800" },

  inputSection: { gap: 24, marginBottom: 32 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  inputWrapper: {
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  currencyPrefix: { fontSize: 18, fontWeight: "900", color: "#10B981", marginRight: 8 },
  textInput: { flex: 1, fontSize: 18, fontWeight: "700" },
  row: { flexDirection: "row", gap: 16 },
  infoBox: { padding: 24, borderRadius: 28, borderWidth: 1, gap: 12 },
  infoTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoTitle: { fontSize: 15, fontWeight: "800" },
  infoText: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
});
