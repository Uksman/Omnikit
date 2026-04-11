import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";

export default function TimerTool() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [mode, setMode] = useState("stopwatch"); // 'stopwatch' or 'timer'
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0); // in milliseconds
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  // Stopwatch logic
  useEffect(() => {
    if (isActive && mode === "stopwatch") {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, mode]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const handleToggle = () => setIsActive(!isActive);

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isActive) {
      setLaps([{ id: Date.now(), time }, ...laps]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Timer & Stopwatch</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.modeTabs}>
        <TouchableOpacity 
          onPress={() => { setMode("stopwatch"); handleReset(); }}
          style={[styles.tab, mode === "stopwatch" && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
        >
          <Text style={[styles.tabText, { color: mode === "stopwatch" ? colors.primary : colors.textMuted }]}>Stopwatch</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => { setMode("timer"); handleReset(); }}
          style={[styles.tab, mode === "timer" && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
        >
          <Text style={[styles.tabText, { color: mode === "timer" ? colors.primary : colors.textMuted }]}>Timer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={[styles.timerCircle, { borderColor: colors.surface }]}>
          <Text style={[styles.timeDisplay, { color: colors.textPrimary }]}>{formatTime(time)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            onPress={handleReset}
            style={[styles.controlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <RotateCcw size={28} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleToggle}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            {isActive ? <Pause size={32} color="white" fill="white" /> : <Play size={32} color="white" fill="white" />}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLap}
            style={[styles.controlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            disabled={mode === "timer"}
          >
            <TimerIcon size={28} color={mode === "timer" ? colors.border : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {mode === "stopwatch" && (
          <ScrollView style={styles.lapsList} showsVerticalScrollIndicator={false}>
            {laps.map((lap, index) => (
              <View key={lap.id} style={[styles.lapItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.lapLabel, { color: colors.textMuted }]}>Lap {laps.length - index}</Text>
                <Text style={[styles.lapTime, { color: colors.textPrimary }]}>{formatTime(lap.time)}</Text>
              </View>
            ))}
          </ScrollView>
        )}
        
        {mode === "timer" && (
            <View style={styles.timerComingSoon}>
                <Text style={{color: colors.textMuted, fontSize: 16, fontWeight: "600"}}>Countdown coming in next update!</Text>
            </View>
        )}
      </View>
    </View>
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
  modeTabs: { flexDirection: "row", paddingHorizontal: 24, marginTop: 10 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabText: { fontSize: 16, fontWeight: "700" },
  mainContent: { flex: 1, alignItems: "center", padding: 24 },
  timerCircle: { 
    width: 280, 
    height: 280, 
    borderRadius: 140, 
    borderWidth: 10, 
    alignItems: "center", 
    justifyContent: "center",
    marginVertical: 40,
  },
  timeDisplay: { fontSize: 48, fontWeight: "900", fontVariant: ["tabular-nums"] },
  controls: { flexDirection: "row", alignItems: "center", gap: 32, marginBottom: 40 },
  controlBtn: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  playBtn: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center", elevation: 4 },
  lapsList: { width: "100%", flex: 1 },
  lapItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 16, borderBottomWidth: 1 },
  lapLabel: { fontSize: 16, fontWeight: "600" },
  lapTime: { fontSize: 16, fontWeight: "700", fontVariant: ["tabular-nums"] },
  timerComingSoon: { marginTop: 40 },
});
