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
import { ChevronLeft, Code, Copy, RefreshCw } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { Buffer } from "buffer";
import { useClipboard } from "../../hooks/useClipboard";

export default function Base64Tool() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isEncode, setIsEncode] = useState(true);

  const processText = useCallback(() => {
    if (!input) {
      setOutput("");
      return;
    }

    try {
      if (isEncode) {
        setOutput(Buffer.from(input, "utf-8").toString("base64"));
      } else {
        setOutput(Buffer.from(input, "base64").toString("utf-8"));
      }
    } catch (_err) {
      setOutput("Error: Invalid Base64 data");
    }
  }, [input, isEncode]);

  useEffect(() => {
    processText();
  }, [processText]);

  const { copyToClipboard } = useClipboard();

  const handleCopy = async () => {
    await copyToClipboard(output);
  };

  const swapMode = () => {
    setIsEncode(!isEncode);
    setInput(output && !output.startsWith("Error") ? output : "");
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Base64 Tool</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Mode Toggle */}
        <View style={[styles.toggleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => setIsEncode(true)}
            style={[styles.toggleBtn, isEncode && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.toggleText, { color: isEncode ? "white" : colors.textPrimary }]}>Encode</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsEncode(false)}
            style={[styles.toggleBtn, !isEncode && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.toggleText, { color: !isEncode ? "white" : colors.textPrimary }]}>Decode</Text>
          </TouchableOpacity>
        </View>

        {/* Input Text Area */}
        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>INPUT</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              multiline
              placeholder={isEncode ? "Type text to encode..." : "Paste base64 to decode..."}
              placeholderTextColor={colors.textMuted}
              style={[styles.textInput, { color: colors.textPrimary }]}
              value={input}
              onChangeText={setInput}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={swapMode} style={[styles.swapBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <RefreshCw size={20} color={colors.primary} />
            <Text style={[styles.swapBtnText, { color: colors.textPrimary }]}>Swap Mode</Text>
          </TouchableOpacity>
        </View>

        {/* Output Text Area */}
        <View style={styles.outputSection}>
          <View style={styles.outputHeader}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>RESULT</Text>
            {output && !output.startsWith("Error") && (
              <TouchableOpacity onPress={handleCopy} style={styles.copyLink}>
                <Copy size={14} color={colors.primary} />
                <Text style={[styles.copyLinkText, { color: colors.primary }]}>Copy</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.outputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.resultText, { color: output.startsWith("Error") ? colors.error : colors.textPrimary }]}>
              {output || "Result will appear here..."}
            </Text>
          </View>
        </View>

        <View style={styles.tipBox}>
          <Code size={18} color={colors.textMuted} />
          <Text style={[styles.tipText, { color: colors.textMuted }]}>
            Base64 is used to encode binary data into a text format that can be easily shared or transmitted.
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
  scrollContent: { padding: 24, paddingBottom: 60 },
  toggleContainer: {
    flexDirection: "row",
    padding: 6,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 32,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: { fontSize: 13, fontWeight: "700" },
  inputSection: { gap: 10 },
  label: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  inputBox: { height: 160, borderRadius: 24, borderWidth: 1, padding: 20 },
  textInput: { flex: 1, fontSize: 16, fontWeight: "500", lineHeight: 22 },
  actionRow: { marginVertical: 16, alignItems: "center" },
  swapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  swapBtnText: { fontSize: 14, fontWeight: "700" },
  outputSection: { gap: 10 },
  outputHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  copyLink: { flexDirection: "row", alignItems: "center", gap: 6 },
  copyLinkText: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  outputBox: { minHeight: 120, borderRadius: 24, borderWidth: 1, padding: 20 },
  resultText: { fontSize: 16, fontWeight: "600", lineHeight: 22 },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
    paddingHorizontal: 4,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18, fontStyle: "italic" },
});
