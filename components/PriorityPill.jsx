import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PRIORITIES } from "../constants/priorities";


export function PriorityPill({ priority }) {
  const p = PRIORITIES.find((x) => x.key === priority) || PRIORITIES[1];
  const Icon = p.icon;
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: p.color + "20", borderColor: p.color + "50" },
      ]}>
      <Icon size={10} color={p.color} strokeWidth={2.5} />
      <Text style={[styles.text, { color: p.color }]}>{p.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: { fontSize: 10, fontWeight: "800" },
});
