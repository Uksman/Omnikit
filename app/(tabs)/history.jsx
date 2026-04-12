import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Trash2,
  Filter,
} from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useHistory } from "../../context/HistoryContext";
import { HistoryCard } from "../../components/HistoryCard";


export default function HistoryScreen() {
  const { colors } = useAppTheme();
  const { history, clearHistory, isLoading } = useHistory();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Activity
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {history.length} {history.length === 1 ? 'log' : 'logs'} stored
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Filter size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No activity logs yet.
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
              RECENT ACTIVITY
            </Text>
            {history.map((item) => (
              <HistoryCard
                key={item.id}
                type={item.type}
                title={item.title}
                subtitle={item.subtitle}
                time={item.time}
                value={item.value}
              />
            ))}

            {/* Clear All Footer */}
            <TouchableOpacity 
              style={styles.clearAll}
              onPress={clearHistory}
            >
              <Trash2 size={16} color={colors.textMuted} />
              <Text style={[styles.clearText, { color: colors.textMuted }]}>
                Clear All History
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, fontWeight: "600", marginTop: 2 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginVertical: 16,
    marginLeft: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  cardSubtitle: { fontSize: 13, fontWeight: "500" },
  cardValue: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  clearAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 30,
    padding: 20,
  },
  clearText: { fontSize: 14, fontWeight: "700" },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
