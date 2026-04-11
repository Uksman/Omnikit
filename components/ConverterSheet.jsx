import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { X, ArrowUpDown, Save, ChevronDown } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { useHistory } from "../context/HistoryContext";
import { CONVERSION_DATA } from "../constants/conversions";
import { calculateUnitConversion, calculateTemperatureConversion } from "../utils/calculators";
import { formatDecimal } from "../utils/formatters";
import { useCurrencyRate } from "../hooks/useCurrencyRate";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ConverterSheet({ type, onClose }) {
  const { colors } = useAppTheme();
  const { addHistory } = useHistory();

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
    
    alert("Saved to History!");
  };

  return (
    <View style={[styles.sheet, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.handleWrapper}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {type.toUpperCase()} CONVERTER
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>
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
              onChangeText={setVal}
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

      <Modal visible={!!showPicker} animationType="fade" transparent>
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
  sheet: {
    height: SCREEN_HEIGHT * 0.65,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  handleWrapper: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 12,
  },
  content: {
    gap: 12,
  },
  box: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  label: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  unitBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
    marginBottom: 4,
  },
  input: {
    fontSize: 32,
    fontWeight: "700",
  },
  resultText: {
    fontSize: 32,
    fontWeight: "700",
  },
  rateStatus: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    alignItems: "center",
    marginVertical: -20,
    zIndex: 10,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#020617",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    borderRadius: 32,
    width: "100%",
    maxHeight: "70%",
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
