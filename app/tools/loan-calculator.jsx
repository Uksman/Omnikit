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
import { ChevronLeft, Calendar } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { calculateLoanDetails } from "../../utils/calculators";
import { useHistory } from "../../context/HistoryContext";
import { sanitizeNumeric } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";
import { useCurrencyStore } from "../../store/useCurrencyStore";



export default function LoanPlanner() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addHistory } = useHistory();
  const { showToast } = useToast();
  const { currency } = useCurrencyStore();

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [result, setResult] = useState({ monthly: 0, total: 0, interest: 0, amortization: [] });

  const calculateLoan = useCallback(() => {
    const res = calculateLoanDetails(amount, rate, term);
    setResult(res);
  }, [amount, rate, term]);

  useEffect(() => {
    calculateLoan();
  }, [calculateLoan]);

  const interestRatio = result.total > 0 ? (result.interest / result.total) * 100 : 0;

  const handleSave = () => {
    if (parseFloat(result.monthly) <= 0) return;
    
    addHistory({
      type: 'loan',
      title: `${currency.symbol}${amount} Loan at ${rate}%`,
      subtitle: `${term} Years Loan`,
      value: `${currency.symbol}${result.monthly}/mo`,
      time: "Just now",
    });
    showToast("Saved to Activity!");
  };

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
          Loan Planner
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Results Card */}
        <View style={[styles.resultCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.resultLabel}>Monthly Payment</Text>
          <Text style={styles.resultValue}>{currency.symbol}{result.monthly}</Text>

          <View style={styles.visualizerContainer}>
            <View style={styles.visualizerHeader}>
              <Text style={styles.visualizerText}>Cost of Borrowing</Text>
              <Text style={styles.visualizerText}>
                {Math.round(interestRatio)}% Interest
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${interestRatio}%`, backgroundColor: "#FFD700" },
                ]}
              />
            </View>
          </View>

          <View style={styles.resultRow}>
            <View>
              <Text style={styles.subLabel}>Total Debt</Text>
              <Text style={styles.subValue}>{currency.symbol}{result.total}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.subLabel}>Interest</Text>
              <Text style={styles.subValue}>{currency.symbol}{result.interest}</Text>
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
              opacity: parseFloat(amount) > 0 ? 1 : 0.5,
            },
          ]}
          disabled={!(parseFloat(amount) > 0)}
        >
          <Calendar size={20} color={colors.primary} />
          <Text style={[styles.saveButtonText, { color: colors.textPrimary }]}>Save to Activity</Text>
        </TouchableOpacity>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>LOAN AMOUNT</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <Text style={styles.currencyPrefix}>{currency.symbol}</Text>
              <TextInput
                placeholder="e.g. 10000"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={[styles.textInput, { color: colors.textPrimary }]}
                value={amount}
                onChangeText={(text) => setAmount(sanitizeNumeric(text))}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>RATE (%)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  placeholder="5.5"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={rate}
                  onChangeText={(text) => setRate(sanitizeNumeric(text))}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>TERM (YEARS)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  placeholder="30"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={term}
                  onChangeText={(text) => setTerm(sanitizeNumeric(text))}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Breakdown Preview */}
        {result.amortization.length > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>PAYMENT SCHEDULE</Text>
            <View style={[styles.breakdownList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {result.amortization.slice(0, 12).map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.breakdownRow, 
                    index !== 11 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                  ]}
                >
                  <Text style={[styles.monthText, { color: colors.textMuted }]}>
                    Month {index + 1}
                  </Text>
                  <Text style={[styles.balanceText, { color: colors.textPrimary }]}>
                    {currency.symbol}{Number(item.balance).toLocaleString()}
                  </Text>
                </View>
              ))}
              <Text style={[styles.moreText, { color: colors.primary }]}>+ Full schedule available in history</Text>
            </View>
          </View>
        )}
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
  resultCard: { padding: 24, borderRadius: 32, marginBottom: 24 },
  resultLabel: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "700", textTransform: "uppercase" },
  resultValue: { color: "white", fontSize: 48, fontWeight: "900", marginVertical: 8 },
  visualizerContainer: { marginVertical: 16 },
  visualizerHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  visualizerText: { color: "white", fontSize: 11, fontWeight: "700" },
  progressBarBg: { height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3 },
  progressFill: { height: "100%", borderRadius: 3 },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  subLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "700" },
  subValue: { color: "white", fontSize: 18, fontWeight: "800" },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 32,
    gap: 12,
    borderWidth: 1,
  },
  saveButtonText: { fontSize: 16, fontWeight: "700" },
  inputSection: { gap: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  inputWrapper: {
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  currencyPrefix: { fontSize: 18, fontWeight: "900", color: "#6366F1", marginRight: 8 },
  textInput: { fontSize: 18, fontWeight: "700", flex: 1 },
  row: { flexDirection: "row", gap: 16 },
  breakdownSection: { marginTop: 32 },
  chartTitle: { fontSize: 12, fontWeight: "800", letterSpacing: 1, marginBottom: 16 },
  breakdownList: { borderRadius: 24, borderWidth: 1, padding: 16 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  monthText: { fontSize: 14, fontWeight: "600" },
  balanceText: { fontSize: 14, fontWeight: "800" },
  moreText: { textAlign: "center", marginTop: 12, fontSize: 12, fontWeight: "700" },
});
