import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Repeat,
  Calculator,
  QrCode,
  ChevronRight,
  ShieldCheck,
  Droplets,
  Timer as Clock,
  BadgePercent,
  TrendingUp,
  Landmark,
} from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";

export const HistoryCard = ({ type, title, subtitle, time, value, onPress, compact = false }) => {
  const { colors } = useAppTheme();

  const config = {
    convert: { icon: Repeat, color: "#6366F1", label: "Unit" },
    tip: { icon: Calculator, color: "#10B981", label: "Tip" },
    qr: { icon: QrCode, color: "#F59E0B", label: "QR" },
    password: { icon: ShieldCheck, color: "#3B82F6", label: "Pass" },
    bmi: { icon: TrendingUp, color: "#10B981", label: "BMI" },
    water: { icon: Droplets, color: "#06B6D4", label: "Water" },
    loan: { icon: Landmark, color: "#6366F1", label: "Loan" },
    investment: { icon: TrendingUp, color: "#8B5CF6", label: "Invest" },
    discount: { icon: BadgePercent, color: "#10B981", label: "Sale" },
    timer: { icon: Clock, color: "#F43F5E", label: "Time" },
  };

  const toolConfig = config[type] || { icon: Repeat, color: colors.primary, label: "Tool" };
  const { icon: Icon, color, label } = toolConfig;

  if (compact) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        style={styles.compactActivityItem}
      >
        <View style={[styles.activityIcon, { backgroundColor: `${color}15` }]}>
          <Icon size={16} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.activityTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.activityTime, { color: colors.textMuted }]}>
            {time} • {value || subtitle}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.textMuted} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badgeContainer}>
          <View style={[styles.typeBadge, { backgroundColor: `${color}15` }]}>
            <Icon size={14} color={color} />
            <Text style={[styles.typeText, { color: color }]}>{label}</Text>
          </View>
          <Text style={[styles.timeText, { color: colors.textMuted }]}>
            {time}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.textMuted} />
      </View>

      <View style={styles.cardBody}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        {value && (
          <Text style={[styles.cardValue, { color: colors.textPrimary }]}>
            {value}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  typeText: { fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  timeText: { fontSize: 12, fontWeight: "500" },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  cardSubtitle: { fontSize: 13, fontWeight: "500" },
  cardValue: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  compactActivityItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: { fontSize: 15, fontWeight: "600" },
  activityTime: { fontSize: 12, fontWeight: "500", marginTop: 2 },
});
