import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";

/**
 * Standard list item for tools in the Tools screen.
 */
export const ToolItem = ({ icon: Icon, title, description, color, onPress, isLast }) => {
  const { colors } = useAppTheme();
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.toolItem, 
        { borderBottomColor: colors.border, borderBottomWidth: isLast ? 0 : 1 }
      ]}
    >
      <View style={styles.toolLeft}>
        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.toolTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
            {description}
          </Text>
        </View>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toolItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  toolLeft: { flexDirection: "row", alignItems: "center", gap: 16, flex: 1 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: { flex: 1 },
  toolTitle: { fontSize: 16, fontWeight: "700" },
  toolDesc: { fontSize: 12, fontWeight: "500", marginTop: 2 },
});
