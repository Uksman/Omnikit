import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { PriorityPill } from "./PriorityPill";
import { PRIORITIES } from "../constants/priorities";

export function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const { colors } = useAppTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  const p = PRIORITIES.find((x) => x.key === task.priority) || PRIORITIES[1];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          task.completed && { opacity: 0.6 },
        ]}
      >
        {!task.completed && <View style={[styles.accent, { backgroundColor: p.color }]} />}

        <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.check}>
          {task.completed
            ? <CheckCircle2 size={26} color="#6366F1" />
            : <Circle size={26} color={colors.textMuted} />
          }
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: task.completed ? colors.textMuted : colors.textPrimary },
              task.completed && styles.strike,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {!!task.note && (
            <Text style={[styles.note, { color: colors.textMuted }]} numberOfLines={1}>
              {task.note}
            </Text>
          )}
          <PriorityPill priority={task.priority} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn} activeOpacity={0.7}>
            <Pencil size={15} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={[styles.actionBtn, styles.deleteBtn]} activeOpacity={0.7}>
            <Trash2 size={15} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    overflow: "hidden",
    minHeight: 72,
  },
  accent:  { width: 4, alignSelf: "stretch" },
  check:   { paddingHorizontal: 14, paddingVertical: 12 },
  content: { flex: 1, gap: 4, paddingVertical: 14 },
  title:   { fontSize: 15, fontWeight: "700", lineHeight: 21 },
  strike:  { textDecorationLine: "line-through" },
  note:    { fontSize: 12, fontWeight: "500", lineHeight: 16 },
  actions: { flexDirection: "row", gap: 4, marginLeft: 8 },
  actionBtn: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  deleteBtn: { backgroundColor: "#EF444412" },
});
