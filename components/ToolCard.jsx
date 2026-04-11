import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAppTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

/**
 * Standard card for tool grids (Home screen mini-grid or Tools screen list).
 */
export const ToolCard = ({ name, icon: Icon, color, onPress, size = "small" }) => {
  const { colors } = useAppTheme();

  if (size === "small") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.miniCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Icon color={color} size={24} />
        <Text style={[styles.miniCardText, { color: colors.textPrimary }]}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fullCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Icon color={color} size={32} />
      <Text style={[styles.fullCardText, { color: colors.textPrimary }]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  miniCard: {
    width: (width - 72) / 3,
    height: 100,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  miniCardText: { fontSize: 13, fontWeight: "700" },
  
  fullCard: {
    width: (width - 64) / 2,
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  fullCardText: { fontSize: 15, fontWeight: "800", textAlign: "center" },
});
