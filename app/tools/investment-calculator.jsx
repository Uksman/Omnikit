import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, TrendingUp } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { useHistory } from "../../context/HistoryContext";
import { calculateFutureValue } from "../../utils/calculators";
import { sanitizeNumeric } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";
import { useCurrencyStore } from "../../store/useCurrencyStore";

const screenWidth = Dimensions.get("window").width;

export default function InvestmentCalculator() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addHistory } = useHistory();
  const { showToast } = useToast();
  const { currency } = useCurrencyStore();

  const [principal, setPrincipal] = useState("");
  const [contribution, setContribution] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState({ total: 0, interest: 0, invested: 0 });

  const handleSave = () => {
    if (parseFloat(result.total) <= 0) return;
    
    addHistory({
      type: 'investment',
      title: `${currency.symbol}${Number(result.total).toLocaleString()} Projected`,
      subtitle: `${years}y | ${currency.symbol}${contribution}/mo`,
      value: `Grow to ${currency.symbol}${Number(result.total).toLocaleString()}`,
      time: "Just now",
    });
    showToast("Saved to Activity!");
  };

  const chartData = useMemo(() => {
    const yr = parseInt(years) || 0;
    const pr = parseFloat(principal) || 0;
    const ct = parseFloat(contribution) || 0;
    const rt = parseFloat(rate) || 0;

    if (yr < 1) return { labels: ["0"], datasets: [{ data: [0] }] };

    const labels = [];
    const dataPoints = [];
    const step = Math.max(1, Math.ceil(yr / 5));

    for (let i = 0; i <= yr; i += step) {
      labels.push(`${i}y`);
      const val = calculateFutureValue(pr, ct, rt, i);
      dataPoints.push(parseFloat(val.total));
    }

    return {
      labels,
      datasets: [{ data: dataPoints }],
    };
  }, [principal, contribution, rate, years]);

  const calculateInvestment = useCallback(() => {
    const res = calculateFutureValue(principal, contribution, rate, years);
    setResult(res);
  }, [principal, contribution, rate, years]);

  useEffect(() => {
    calculateInvestment();
  }, [calculateInvestment]);

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
          Growth Engine
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Results Card */}
        <View style={[styles.resultCard, { backgroundColor: "#8B5CF6" }]}>
          <Text style={styles.resultLabel}>Future Value</Text>
          <Text style={styles.resultValue}>
            {currency.symbol}{Number(result.total).toLocaleString()}
          </Text>

          <View style={styles.resultRow}>
            <View>
              <Text style={styles.subLabel}>Invested</Text>
              <Text style={styles.subValue}>
                {currency.symbol}{Number(result.invested).toLocaleString()}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.subLabel}>Profit</Text>
              <Text style={styles.subValue}>
                {currency.symbol}{Number(result.interest).toLocaleString()}
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
              opacity: parseFloat(principal) > 0 ? 1 : 0.5,
            },
          ]}
          disabled={!(parseFloat(principal) > 0)}
        >
          <TrendingUp size={20} color={colors.primary} />
          <Text style={[styles.saveButtonText, { color: colors.textPrimary }]}>Save to Activity</Text>
        </TouchableOpacity>

        {/* Real-time Growth Chart */}
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>
            PROJECTED GROWTH
          </Text>
          <LineChart
            data={chartData}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              backgroundColor: colors.background,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              labelColor: (opacity = 1) => colors.textMuted,
              style: { borderRadius: 16 },
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#8B5CF6" },
            }}
            bezier
            style={styles.chartStyle}
          />
        </View>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1.5 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>INITIAL</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={styles.currencyPrefix}>{currency.symbol}</Text>
                <TextInput
                  placeholder="1000"
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={principal}
                  onChangeText={(text) => setPrincipal(sanitizeNumeric(text))}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>RATE %</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  placeholder="7"
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={rate}
                  onChangeText={(text) => setRate(sanitizeNumeric(text))}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1.5 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>MONTHLY</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={styles.currencyPrefix}>{currency.symbol}</Text>
                <TextInput
                  placeholder="100"
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={contribution}
                  onChangeText={(text) => setContribution(sanitizeNumeric(text))}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>YEARS</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  placeholder="10"
                  keyboardType="decimal-pad"
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  value={years}
                  onChangeText={(text) => setYears(sanitizeNumeric(text))}
                />
              </View>
            </View>
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
  chartContainer: { marginBottom: 24 },
  chartTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 12 },
  chartStyle: { borderRadius: 16, paddingRight: 40 },
  resultCard: { padding: 24, borderRadius: 28, marginBottom: 20 },
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
  saveButtonText: { fontSize: 16, fontWeight: "700" },
  resultLabel: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
  resultValue: { color: "white", fontSize: 36, fontWeight: "900", marginVertical: 4 },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  subLabel: { color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: "700" },
  subValue: { color: "white", fontSize: 15, fontWeight: "800" },
  inputSection: { gap: 16 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  inputWrapper: {
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  currencyPrefix: { fontSize: 16, fontWeight: "900", color: "#8B5CF6", marginRight: 6 },
  textInput: { flex: 1, fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", gap: 12 },
});
