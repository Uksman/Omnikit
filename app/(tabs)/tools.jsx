import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  LayoutAnimation,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, ChevronRight, ChevronDown } from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import ConverterSheet from "../../components/ConverterSheet";
import { useRouter } from "expo-router";
import { ToolItem } from "../../components/ToolItem";
import { TOOL_SECTIONS } from "../../constants/tools";


const SectionHeader = ({ title, isCollapsed, onToggle }) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onToggle}
      style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      {isCollapsed ? (
        <ChevronRight size={14} color={colors.textMuted} />
      ) : (
        <ChevronDown size={14} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
};

export default function ToolsScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTool, setActiveTool] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    converters: false,
    finance: false,
    utilities: false,
    productivity: false,
  });

  const toolSections = TOOL_SECTIONS.map((section) => ({
    ...section,
    tools: section.tools.map((tool) => ({
      ...tool,
      onPress:
        tool.type === "converter"
          ? () => openTool(tool.id)
          : () => router.push(tool.route),
    })),
  }));

  const filteredSections = toolSections
    .map((section) => ({
      ...section,
      tools: section.tools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(search.toLowerCase()) ||
          tool.description.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((section) => section.tools.length > 0);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openTool = (type) => {
    setActiveTool(type);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Toolkit
        </Text>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search tools..."
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.textPrimary }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredSections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Search size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No tools found matching &quot;{search}&quot;
            </Text>
          </View>
        ) : (
          filteredSections.map((section) => (
            <React.Fragment key={section.id}>
              <SectionHeader
                title={section.title}
                isCollapsed={collapsedSections[section.id]}
                onToggle={() => toggleSection(section.id)}
              />
              {!collapsedSections[section.id] && (
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}>
                  {section.tools.map((tool, idx) => (
                    <ToolItem
                      key={tool.id}
                      icon={tool.icon}
                      title={tool.title}
                      description={tool.description}
                      color={tool.color}
                      onPress={tool.onPress}
                      isLast={idx === section.tools.length - 1}
                    />
                  ))}
                </View>
              )}
            </React.Fragment>
          ))
        )}
      </ScrollView>

      {/* Converter Bottom Sheet */}
      <Modal
        visible={!!activeTool}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveTool(null)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setActiveTool(null)}
          style={styles.modalOverlay}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {activeTool && (
              <ConverterSheet
                type={activeTool}
                onClose={() => setActiveTool(null)}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 10 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16, fontWeight: "500" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 12, fontWeight: "800", letterSpacing: 1.2 },
  card: { borderRadius: 24, borderWidth: 1, overflow: "hidden" },
  toolTitle: { fontSize: 16, fontWeight: "700" },
  toolDesc: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "transparent",
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: "80%",
  },
});
