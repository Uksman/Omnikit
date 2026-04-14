import React from "react";
import { View, Text } from "react-native";

export function CompletionRing({ percent }) {
  const size = 110;
  const strokeWidth = 10;
  const pct = Math.min(100, Math.max(0, percent));
  const fillDeg = (pct / 100) * 360;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: size, height: size, borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: "rgba(255,255,255,0.15)",
          position: "absolute",
        }}
      />
      {/* Fill */}
      {pct > 0 && (
        <View
          style={{
            width: size, height: size, borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: "transparent",
            borderTopColor: "rgba(255,255,255,0.9)",
            borderRightColor: fillDeg >= 90 ? "rgba(255,255,255,0.9)" : "transparent",
            borderBottomColor: fillDeg >= 180 ? "rgba(255,255,255,0.9)" : "transparent",
            borderLeftColor: fillDeg >= 270 ? "rgba(255,255,255,0.9)" : "transparent",
            position: "absolute",
            transform: [{ rotate: "-90deg" }],
          }}
        />
      )}
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "900" }}>{pct}%</Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: "700" }}>DONE</Text>
      </View>
    </View>
  );
}
