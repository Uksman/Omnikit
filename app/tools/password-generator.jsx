import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, ShieldCheck, Copy, RefreshCw } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { generatePassword as generatePasswordUtil } from "../../utils/calculators";
import { useClipboard } from "../../hooks/useClipboard";

export default function PasswordGenerator() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = useCallback(() => {
    const result = generatePasswordUtil(length, options);
    setPassword(result);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const { copyToClipboard } = useClipboard();

  const handleCopy = async () => {
    await copyToClipboard(password);
  };

  const getStrengthColor = () => {
    if (length < 8) return "#EF4444";
    if (length < 12) return "#F59E0B";
    if (length < 16) return "#10B981";
    return "#3B82F6";
  };

  const getStrengthLabel = () => {
    if (length < 8) return "Weak";
    if (length < 12) return "Fair";
    if (length < 16) return "Strong";
    return "Very Secure";
  };

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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Password Gen</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Result Area */}
        <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.passwordText, { color: colors.textPrimary }]} numberOfLines={2}>
            {password || "Select options..."}
          </Text>
          
          <View style={styles.strengthIndicator}>
            <View style={[styles.strengthBar, { backgroundColor: getStrengthColor(), width: `${(length / 32) * 100}%` }]} />
            <Text style={[styles.strengthText, { color: getStrengthColor() }]}>{getStrengthLabel()}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={generatePassword} style={styles.iconBtn}>
              <RefreshCw size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCopy} style={[styles.copyBtn, { backgroundColor: colors.primary }]}>
              <Copy size={20} color="white" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Area */}
        <View style={styles.settingsSection}>
          <View style={styles.settingHeader}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>LENGTH: {Math.round(length)}</Text>
          </View>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={4}
            maximumValue={32}
            step={1}
            value={length}
            onValueChange={setLength}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />

          <View style={styles.optionsList}>
            {Object.entries(options).map(([key, value]) => (
              <View key={key} style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Switch
                  value={value}
                  onValueChange={(val) => setOptions(prev => ({ ...prev, [key]: val }))}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={Platform.OS === "ios" ? undefined : (value ? "white" : "#f4f3f4")}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <ShieldCheck size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            Passwords are generated locally on your device and are never stored or transmitted.
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
  resultCard: {
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 32,
  },
  passwordText: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    height: 80,
    textAlignVertical: "center",
  },
  strengthIndicator: { width: "100%", marginTop: 20, gap: 8 },
  strengthBar: { height: 6, borderRadius: 3 },
  strengthText: { fontSize: 12, fontWeight: "800", textTransform: "uppercase", textAlign: "right" },
  actionRow: { flexDirection: "row", marginTop: 24, gap: 16, width: "100%" },
  iconBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  copyBtn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  copyBtnText: { color: "white", fontSize: 18, fontWeight: "700" },
  settingsSection: { width: "100%" },
  settingHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  label: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  optionsList: { marginTop: 24 },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionLabel: { fontSize: 16, fontWeight: "600" },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
    paddingHorizontal: 12,
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: "500" },
});
