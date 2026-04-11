import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowRightLeft,
  Calculator,
  QrCode,
  Bell,
} from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useHistory } from "../../context/HistoryContext";
import { useRouter } from "expo-router";
import { PromoCarousel } from "../../components/PromoCarousel";
import { ToolCard } from "../../components/ToolCard";
import { HistoryCard } from "../../components/HistoryCard";


export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { history } = useHistory();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const recentHistory = history.slice(0, 3);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* REFINED HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>
              Welcome back,
            </Text>
            <Text style={[styles.brand, { color: colors.textPrimary }]}>
              Omnikit
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.notifButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Bell size={20} color={colors.textPrimary} />
            <View
              style={[styles.notifDot, { backgroundColor: colors.primary }]}
            />
          </TouchableOpacity>
        </View>

        <PromoCarousel />

        {/* QUICK ACCESS GRID */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            UTILITIES
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/tools")}>
            <Text
              style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}
            >
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {[
            { name: "Units", icon: ArrowRightLeft, color: "#6366F1", route: "/(tabs)/tools" },
            { name: "Tip", icon: Calculator, color: "#10B981", route: "/(tabs)/tools"  },
            { name: "Scanner", icon: QrCode, color: "#F59E0B", route: "/(tabs)/tools"  },
          ].map((item, i) => (
            <ToolCard 
              key={i}
              name={item.name}
              icon={item.icon}
              color={item.color}
              onPress={() => router.push(item.route)}
              size="small"
            />
          ))}
        </View>

        {/* RECENT ACTIVITY PREVIEW */}
        <View style={[styles.sectionRow, { marginTop: 32 }]}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            RECENT ACTIVITY
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
            <Text
              style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}
            >
              Full History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View
          style={[
            styles.recentActivity,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {recentHistory.length === 0 ? (
            <Text style={{ color: colors.textMuted, textAlign: "center", padding: 10 }}>
              No recent activity
            </Text>
          ) : (
            recentHistory.map((item, index) => (
              <View 
                key={item.id}
                style={[
                  index !== recentHistory.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 12 }
                ]}
              >
                <HistoryCard 
                  type={item.type}
                  title={item.title}
                  time={item.time}
                  value={item.value}
                  onPress={() => router.push("/(tabs)/history")}
                  compact
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  brand: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  notifButton: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    position: "relative",
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 12,
    right: 12,
    borderWidth: 2,
    borderColor: "#0A0A0A",
  },

  // Recent Activity
  recentActivity: { borderRadius: 24, borderWidth: 1, padding: 16 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
  },
});
