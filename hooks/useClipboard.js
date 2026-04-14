import { useState } from "react";
import { Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

export const useClipboard = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async (text, showToast = true) => {
    if (!text) return false;
    
    await Clipboard.setStringAsync(String(text));
    setHasCopied(true);
    
    if (showToast) {
      Alert.alert("Copied!", "Copied to clipboard.");
    }

    setTimeout(() => setHasCopied(false), 2000);
    return true;
  };

  return { copyToClipboard, hasCopied };
};
