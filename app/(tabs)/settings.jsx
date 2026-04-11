// app/(tabs)/settings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../context/ThemeContext";
import { useHistory } from "../../context/HistoryContext";
import { useRouter } from "expo-router";
import {
  User,
  Bell,
  ShieldCheck,
  Moon,
  ChevronRight,
  Info,
  LogOut,
  Star,
  ExternalLink,
  Coins,
  Zap,
  Clock3,
  Database,
  Trash2,
} from "lucide-react-native";
const SettingsItem = ({
  icon: Icon,
  label,
  value,
  type = "link",
  isLast = false,
  switchValue,
  onSwitchChange,
  onPress,
}) => {
  const { colors } = useAppTheme();
  const [localOn, setLocalOn] = useState(false);
  const switchOn =
    onSwitchChange != null ? Boolean(switchValue) : localOn;
  const handleSwitch = (next) => {
    if (onSwitchChange) onSwitchChange(next);
    else setLocalOn(next);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.item,
        { borderBottomColor: colors.border, borderBottomWidth: isLast ? 0 : 1 },
      ]}
    >
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: "rgba(99, 102, 241, 0.1)" },
          ]}
        >
          <Icon size={20} color={colors.primary} />
        </View>
        <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>
          {label}
        </Text>
      </View>

      <View style={styles.itemRight}>
        {type === "toggle" ? (
          <Switch
            value={switchOn}
            onValueChange={handleSwitch}
            trackColor={{ false: colors.elevated, true: colors.primary }}
            thumbColor={"#FFFFFF"}
          />
        ) : (
          <>
            {value && (
              <Text style={[styles.itemValue, { color: colors.textMuted }]}>
                {value}
              </Text>
            )}
            <ChevronRight size={18} color={colors.textMuted} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { colors, isDark, setThemePreference } = useAppTheme();
  const { clearHistory } = useHistory();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Settings
        </Text>

        {/* Profile Header */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.elevated }]}>
            <User size={32} color={colors.textSecondary} />
          </View>
          <View>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              Omnikit User
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              Pro Member
            </Text>
          </View>
        </View>

        {/* Preferences Group */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          PREFERENCES
        </Text>
        <View
          style={[
            styles.group,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <SettingsItem icon={Bell} label="Notifications" />
          <SettingsItem
            icon={Moon}
            label="Dark Mode"
            type="toggle"
            switchValue={isDark}
            onSwitchChange={(on) =>
              setThemePreference(on ? "dark" : "light")
            }
          />
          <SettingsItem icon={ShieldCheck} label="Security" isLast />
        </View>

        {/* Tool Customization */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          TOOL KIT SETTINGS
        </Text>
        <View
          style={[
            styles.group,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <SettingsItem icon={Coins} label="Default Currency" value="USD ($)" />
          <SettingsItem icon={Zap} label="Haptic Feedback" type="toggle" />
          <SettingsItem
            icon={Clock3}
            label="Auto-save History"
            type="toggle"
            isLast
          />
        </View>

        {/* Data Management */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          DATA & PRIVACY
        </Text>
        <View
          style={[
            styles.group,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <SettingsItem icon={Database} label="Export History (CSV)" />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={clearHistory}
          >
            <View style={[styles.itemLeft, { flex: 1 }]}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                ]}
              >
                <Trash2 size={20} color={colors.error} />
              </View>
              <Text style={[styles.itemLabel, { color: colors.error }]}>
                Clear All History
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Support Group */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          SUPPORT
        </Text>
        <View
          style={[
            styles.group,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <SettingsItem icon={Star} label="Rate Omnikit" />
          <SettingsItem icon={Info} label="About Version" value="1.0.4" />
          <SettingsItem 
            icon={ExternalLink} 
            label="Privacy Policy" 
            onPress={() => router.push("/privacy")}
            isLast 
          />
        </View>

        {/* Danger Zone */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 100 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: { fontSize: 18, fontWeight: "700" },
  profileEmail: { fontSize: 14, fontWeight: "500" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  group: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 28,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: 64,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: { fontSize: 16, fontWeight: "600" },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemValue: { fontSize: 14, fontWeight: "500" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    padding: 16,
  },
  logoutText: { fontSize: 16, fontWeight: "700" },
  footerText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.5,
  },
});
