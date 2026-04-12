import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Clipboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Copy, ExternalLink, RefreshCw } from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";

export default function QRScanner() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, justifyContent: "center", alignItems: "center", padding: 40 }]}>
        <Text style={[styles.permissionText, { color: colors.textPrimary }]}>We need your permission to show the camera</Text>
        <TouchableOpacity 
          style={[styles.permissionBtn, { backgroundColor: colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
  };

  const handleAction = async () => {
    if (!scannedData) return;
    
    const isUrl = scannedData.startsWith("http://") || scannedData.startsWith("https://");
    
    if (isUrl) {
      const supported = await Linking.canOpenURL(scannedData);
      if (supported) {
        await Linking.openURL(scannedData);
      } else {
        showToast("Cannot open this URL", "error");
      }
    } else {
      Clipboard.setString(scannedData);
      showToast("Content copied to clipboard");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      {/* Scanner View */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={[styles.focusedContainer, { borderColor: colors.primary }]}>
            <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      {/* Header Overlay */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Scanner</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Result Card Overlay */}
      {scanned && (
        <View style={[styles.resultCard, { backgroundColor: colors.surface, bottom: insets.bottom + 40 }]}>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>SCANNED DATA</Text>
            <TouchableOpacity onPress={() => setScanned(false)}>
              <RefreshCw size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.resultText, { color: colors.textPrimary }]} numberOfLines={3}>
            {scannedData}
          </Text>
          <TouchableOpacity 
            style={[styles.resultBtn, { backgroundColor: colors.primary }]}
            onPress={handleAction}
          >
            {scannedData?.startsWith("http") ? (
              <ExternalLink size={20} color="white" />
            ) : (
              <Copy size={20} color="white" />
            )}
            <Text style={styles.resultBtnText}>
              {scannedData?.startsWith("http") ? "Open URL" : "Copy Text"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instruction Toast */}
      {!scanned && (
        <View style={[styles.instructionBox, { bottom: insets.bottom + 100 }]}>
          <Text style={styles.instructionText}>Position QR code within frame</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  unfocusedContainer: {
    flex: 1,
  },
  middleContainer: {
    flexDirection: "row",
    height: 280,
  },
  focusedContainer: {
    width: 280,
    height: 280,
    borderWidth: 0,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
  
  header: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  
  permissionText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  permissionBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  permissionBtnText: { color: "white", fontWeight: "700" },

  resultCard: {
    position: "absolute",
    left: 24,
    right: 24,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultLabel: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  resultText: { fontSize: 16, fontWeight: "600", marginBottom: 20, lineHeight: 24 },
  resultBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  resultBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  
  instructionBox: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  instructionText: { color: "white", fontSize: 14, fontWeight: "600" },
});
