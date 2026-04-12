import React, { useState, useEffect } from "react";
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
// Add this import
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Users,
} from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { calculateTipValues } from "../../utils/calculators";
import { formatDecimal, sanitizeNumeric } from "../../utils/formatters";

import { useHistory } from "../../context/HistoryContext";
import { useToast } from "../../context/ToastContext";
import { useCurrencyStore } from "../../store/useCurrencyStore";

export default function TipCalculator() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addHistory } = useHistory();
  const { showToast } = useToast();
  const { currency } = useCurrencyStore();

  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(1);
  const [results, setResults] = useState({
    tipAmount: 0,
    totalBill: 0,
    perPerson: 0,
  });

  const handleSave = () => {
    if (results.totalBill <= 0) return;
    
    addHistory({
      type: 'tip',
      title: `${currency.symbol}${results.totalBill.toFixed(2)} bill`,
      subtitle: `${tipPercent}% tip | ${people} people`,
      value: `${currency.symbol}${results.perPerson.toFixed(2)} each`,
      time: "Just now",
    });
    showToast("Saved to Activity!");
  };

  useEffect(() => {
    const result = calculateTipValues(bill, tipPercent, people);
    setResults(result);
  }, [bill, tipPercent, people]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}>
      {/* Header unchanged */}
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
            Tip Calc
          </Text>
          <View style={{ width: 44 }} />
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Results Card (Modified to look more like a dynamic receipt) */}
        <View style={[styles.resultCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.resultLabel}>Total Per Person</Text>
          <Text style={styles.resultValue}>
            {currency.symbol}{results.perPerson.toFixed(2)}
          </Text>
          <View style={styles.resultRow}>
            <Text style={styles.subResultText}>
              Bill: {currency.symbol}{formatDecimal(bill || 0)}
            </Text>
            <Text style={styles.subResultText}>
              Tip: {currency.symbol}{formatDecimal(results.tipAmount)}
            </Text>
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
              opacity: results.totalBill > 0 ? 1 : 0.5,
            },
          ]}
          disabled={results.totalBill <= 0}
        >
          <Text style={[styles.saveButtonText, { color: colors.textPrimary }]}>Save to Activity</Text>
        </TouchableOpacity>

        {/* Bill Input */}
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          BILL TOTAL
        </Text>
        <View
          style={[
            styles.inputWrapper,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Text style={[styles.currencyLabel, { color: colors.primary }]}>{currency.symbol}</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            style={[styles.textInput, { color: colors.textPrimary }]}
            value={bill}
            onChangeText={(text) => setBill(sanitizeNumeric(text))}
          />
        </View>

        {/* Dynamic Tip Slider Section */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              TIP PERCENTAGE
            </Text>
            <Text style={[styles.percentageText, { color: colors.primary }]}>
              {Math.round(tipPercent)}%
            </Text>
          </View>

          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={40}
            step={1}
            value={tipPercent}
            onValueChange={setTipPercent}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        </View>

        {/* People Counter */}
        <Text
          style={[
            styles.inputLabel,
            { color: colors.textSecondary, marginTop: 24 },
          ]}>
          SPLIT BETWEEN
        </Text>
        <View style={styles.peopleCounter}>
          <TouchableOpacity
            onPress={() => setPeople(Math.max(1, people - 1))}
            style={[
              styles.countBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={{ color: colors.textPrimary, fontSize: 24 }}>-</Text>
          </TouchableOpacity>

          <View style={styles.peopleDisplay}>
            <Users size={20} color={colors.primary} />
            <Text style={[styles.peopleText, { color: colors.textPrimary }]}>
              {people}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setPeople(people + 1)}
            style={[
              styles.countBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <Text style={{ color: colors.textPrimary, fontSize: 24 }}>+</Text>
          </TouchableOpacity>
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
  resultCard: { borderRadius: 28, padding: 24, marginBottom: 20 },
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
  resultLabel: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 12,
  },
  resultValue: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "900",
    marginVertical: 8,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  subResultText: { color: "#FFF", fontWeight: "600", opacity: 0.9 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  textInput: { flex: 1, fontSize: 18, fontWeight: "700" },
  currencyLabel: { fontSize: 20, fontWeight: "900" },
  sliderSection: { marginTop: 32 },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentageText: { fontSize: 22, fontWeight: "900" },
  peopleCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  countBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  peopleDisplay: { flexDirection: "row", alignItems: "center", gap: 10 },
  peopleText: { fontSize: 24, fontWeight: "800" },
});
