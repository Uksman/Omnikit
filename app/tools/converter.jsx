import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ArrowUpDown, Save, X, ChevronDown } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useHistory } from "../../context/HistoryContext";
import { useToast } from "../../context/ToastContext";
import { CONVERSION_DATA } from "../../constants/conversions";
import { calculateUnitConversion, calculateTemperatureConversion } from "../../utils/calculators";
import { formatDecimal, sanitizeNumeric } from "../../utils/formatters";
import { useCurrencyRate } from "../../hooks/useCurrencyRate";

export default function ConverterScreen() {
  const { colors } = useAppTheme();
  const { addHistory } = useHistory();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const { type = "length" } = useLocalSearchParams();
  const router = useRouter();

  const config = CONVERSION_DATA[type] || CONVERSION_DATA.length;

  const [val, setVal] = useState("");
  const [result, setResult] = useState("0.00");
  const [fromUnit, setFromUnit] = useState(
    config.isTemp || config.isCurrency ? config.units[0] : Object.keys(config.units)[0]
  );
  const [toUnit, setToUnit] = useState(
    config.isTemp || config.isCurrency ? config.units[1] : Object.keys(config.units)[1]
  );
  const [showPicker, setShowPicker] = useState(null); // 'from' or 'to'

  const { rate: liveRate, isLoading: isFetching, error: fetchError } = useCurrencyRate(
    fromUnit,
    toUnit,
    config.isCurrency
  );


  // Real-time conversion logic
  useEffect(() => {
    const num = parseFloat(val);
    if (isNaN(num)) return setResult("0.00");

    let conversionResult;
    if (config.isTemp) {
      conversionResult = calculateTemperatureConversion(val, fromUnit, toUnit);
    } else if (config.isCurrency) {
      if (fromUnit === toUnit) {
        conversionResult = formatDecimal(num);
      } else if (liveRate) {
        conversionResult = formatDecimal(num * liveRate);
      } else {
        conversionResult = "---";
      }
    } else {
      const fromRatio = config.units[fromUnit];
      const toRatio = config.units[toUnit];
      conversionResult = calculateUnitConversion(val, fromRatio, toRatio);
    }
    setResult(conversionResult);
  }, [val, fromUnit, toUnit, config, liveRate]);

  const handleSave = () => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0 || result === "---") return;

    addHistory({
      type: config.isCurrency ? "currency" : "convert",
      title: `${num} ${fromUnit} to ${toUnit}`,
      subtitle: `${type.charAt(0).toUpperCase() + type.slice(1)} Conversion`,
      value: `${result} ${toUnit}`,
      time: "Just now",
    });
    
    // Simple feedback
    showToast("Saved to Activity!");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          {config.isCurrency && (
            <View style={styles.rateStatus}>
              {isFetching ? (
                <Text style={[styles.statusText, { color: colors.primary }]}>
                  Fetching latest rates...
                </Text>
              ) : fetchError ? (
                <Text style={[styles.statusText, { color: colors.error }]}>
                  {fetchError}
                </Text>
              ) : (
                <Text style={[styles.statusText, { color: colors.textMuted }]}>
                  Live Rate: 1 {fromUnit} = {liveRate} {toUnit}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPicker("from")}
            style={[
              styles.box,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.unitBadge, { backgroundColor: colors.background }]}>
              <Text style={[styles.label, { color: colors.primary, marginBottom: 0 }]}>
                {fromUnit}
              </Text>
              <ChevronDown size={14} color={colors.primary} />
            </View>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              autoFocus
              value={val}
              onChangeText={(text) => setVal(sanitizeNumeric(text))}
            />
          </TouchableOpacity>

          <View style={styles.divider}>
            <TouchableOpacity 
              onPress={() => {
                const temp = fromUnit;
                setFromUnit(toUnit);
                setToUnit(temp);
              }}
              style={[styles.circle, { backgroundColor: colors.primary }]}
            >
              <ArrowUpDown size={20} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPicker("to")}
            style={[
              styles.box,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.unitBadge, { backgroundColor: colors.background }]}>
              <Text style={[styles.label, { color: colors.primary, marginBottom: 0 }]}>
                {toUnit}
              </Text>
              <ChevronDown size={14} color={colors.primary} />
            </View>
            <Text style={[styles.resultText, { color: colors.textPrimary }]}>
              {result}
            </Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
            style={[
              styles.saveButton,
              {
                backgroundColor: colors.primary,
                opacity: (parseFloat(val) > 0 && result !== "---") ? 1 : 0.5,
              },
            ]}
            disabled={!(parseFloat(val) > 0 && result !== "---")}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>Save to Activity</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={!!showPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Select Unit
              </Text>
              <TouchableOpacity onPress={() => setShowPicker(null)}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                config.isTemp || config.isCurrency
                  ? config.units
                  : Object.keys(config.units)
              }
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.unitItem}
                  onPress={() => {
                    if (showPicker === "from") setFromUnit(item);
                    if (showPicker === "to") setToUnit(item);
                    setShowPicker(null);
                  }}
                >
                  <Text
                    style={[
                      styles.unitItemText,
                      {
                        color:
                          (showPicker === "from" ? fromUnit : toUnit) === item
                            ? colors.primary
                            : colors.textPrimary,
                        fontWeight:
                          (showPicker === "from" ? fromUnit : toUnit) === item
                            ? "700"
                            : "500",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", padding: 20, gap: 15 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  content: { padding: 24, gap: 10 },
  box: { padding: 24, borderRadius: 28, borderWidth: 1 },
  label: { fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  unitBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },
  input: { fontSize: 40, fontWeight: "700" },
  resultText: { fontSize: 40, fontWeight: "700" },
  rateStatus: { marginBottom: 16, paddingHorizontal: 4 },
  statusText: { fontSize: 13, fontWeight: "600" },
  divider: { alignItems: "center", marginVertical: -25, zIndex: 10 },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#020617",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 20,
    gap: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "60%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  unitItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  unitItemText: {
    fontSize: 18,
  },
});
