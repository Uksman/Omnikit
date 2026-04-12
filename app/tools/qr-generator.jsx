import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, QrCode, Share2, Download, X } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

export default function QRGenerator() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const qrRef = useRef();
  const { showToast } = useToast();

  const [text, setText] = useState("");

  const handleShare = async () => {
    if (!text || !qrRef.current) return;

    qrRef.current.toDataURL(async (dataURL) => {
      try {
        const fileUri = `${FileSystem.cacheDirectory}shared_qr.png`;

        await FileSystem.writeAsStringAsync(fileUri, dataURL, {
          encoding: "base64",
        });

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/png",
            UTI: "public.png",
          });
        }
      } catch (error) {
        console.error("Share Error:", error);
        showToast("Failed to share image", "error");
      }
    });
  };

  const handleDownload = async () => {
    if (!text || !qrRef.current) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Allow access to photos to save.");
        return;
      }

      qrRef.current.toDataURL(async (dataURL) => {
        try {
          const fileUri = `${FileSystem.cacheDirectory}qr_download.png`;

          await FileSystem.writeAsStringAsync(fileUri, dataURL, {
            encoding: "base64",
          });

          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync("Omnikit", asset, false);

          showToast("QR Code saved to gallery!", "success");
        } catch (err) {
          console.error("File System Error:", err);
          showToast("Error generating image file", "error");
        }
      });
    } catch (error) {
      console.error("Permission Error:", error);
      showToast("Could not access gallery", "error");
    }
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
          QR Generator
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* QR Display Area */}
        <View
          style={[
            styles.qrContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          {text ? (
            <View style={styles.qrWrapper}>
              <QRCode
                value={text}
                size={220}
                color="black"
                backgroundColor="white"
                getRef={(c) => (qrRef.current = c)}
              />
            </View>
          ) : (
            <View style={styles.emptyQr}>
              <QrCode size={80} color={colors.border} strokeWidth={1} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Enter content below to generate your QR code
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {text && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={handleShare}
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
              <Share2 size={20} color="white" />
              <Text style={styles.actionBtnText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}>
              <Download size={20} color={colors.textPrimary} />
              <Text
                style={[styles.actionBtnText, { color: colors.textPrimary }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            CONTENT (TEXT OR URL)
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <TextInput
              placeholder="e.g. https://google.com"
              placeholderTextColor={colors.textMuted}
              multiline
              style={[styles.textInput, { color: colors.textPrimary }]}
              value={text}
              onChangeText={setText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {text ? (
              <TouchableOpacity
                onPress={() => setText("")}
                style={styles.clearButton}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
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
  scrollContent: { padding: 24, alignItems: "center" },
  qrContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginBottom: 24,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 24,
    // Add shadow to make it look nicer
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyQr: { alignItems: "center", gap: 16, paddingHorizontal: 40 },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionRow: { flexDirection: "row", gap: 12, width: "100%", marginBottom: 32 },
  actionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBtnText: { fontSize: 16, fontWeight: "700", color: "white" },
  inputSection: { width: "100%", gap: 12 },
  inputLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  inputWrapper: {
    minHeight: 80,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: { flex: 1, fontSize: 16, fontWeight: "600", paddingVertical: 12 },
  clearButton: { padding: 8 },
});
