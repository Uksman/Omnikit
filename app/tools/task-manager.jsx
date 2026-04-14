import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react-native";
import { useAppTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { useTaskStore } from "../../store/useTaskStore";
import { PRIORITIES } from "../../constants/priorities";
import { CompletionRing } from "../../components/CompletionRing";
import { TaskCard } from "../../components/TaskCard";

export default function TaskManagerScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tasks, addTask, toggleTask, editTask, deleteTask, clearCompleted } =
    useTaskStore();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("medium");
  const [addExpanded, setAddExpanded] = useState(false);
  const [completedCollapsed, setCompletedCollapsed] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  const todo = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);
  const pct =
    tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0;

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask({ title: trimmed, note: note.trim(), priority });
    setTitle("");
    setNote("");
    setPriority("medium");
    setAddExpanded(false);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditNote(task.note || "");
    setEditPriority(task.priority || "medium");
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    editTask(editingTask.id, {
      title: editTitle.trim(),
      note: editNote.trim(),
      priority: editPriority,
    });
    setEditModal(false);
  };

  const isEmpty = tasks.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backBtn,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Task List
        </Text>
        {done.length > 0 ? (
          <TouchableOpacity
            onPress={clearCompleted}
            style={[styles.clearDoneBtn, { borderColor: "#EF444440" }]}>
            <Text style={styles.clearDoneText}>Clear Done</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroLabel}>COMPLETION</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNum}>{todo.length}</Text>
                <Text style={styles.heroStatLbl}>Pending</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNum}>{done.length}</Text>
                <Text style={styles.heroStatLbl}>Done</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNum}>{tasks.length}</Text>
                <Text style={styles.heroStatLbl}>Total</Text>
              </View>
            </View>
            <View style={styles.heroProgressBg}>
              <View style={[styles.heroProgressFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.heroProgressLabel}>
              {pct}% complete{tasks.length === 0 ? " — let's go!" : ""}
            </Text>
          </View>
          <CompletionRing percent={pct} />
        </View>

        <View
          style={[
            styles.addPanel,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.addInput, { color: colors.textPrimary }]}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (t && !addExpanded) setAddExpanded(true);
              }}
              onFocus={() => setAddExpanded(true)}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
            <TouchableOpacity
              onPress={handleAdd}
              disabled={!title.trim()}
              style={[
                styles.addFab,
                {
                  backgroundColor: colors.primary,
                  opacity: title.trim() ? 1 : 0.4,
                },
              ]}
              activeOpacity={0.8}>
              <Plus size={20} color="#fff" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {addExpanded && (
            <View style={styles.addExtra}>
              <TextInput
                style={[
                  styles.noteInput,
                  { color: colors.textPrimary, borderColor: colors.border },
                ]}
                placeholder="Add a note (optional)..."
                placeholderTextColor={colors.textMuted}
                value={note}
                onChangeText={setNote}
                multiline
              />
              <View style={styles.priorityPickerRow}>
                <Text
                  style={[
                    styles.priorityPickerLabel,
                    { color: colors.textMuted },
                  ]}>
                  Priority:
                </Text>
                {PRIORITIES.map((p) => {
                  const Icon = p.icon;
                  const active = priority === p.key;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      onPress={() => setPriority(p.key)}
                      activeOpacity={0.8}
                      style={[
                        styles.priorityPickBtn,
                        {
                          backgroundColor: active ? p.color : p.color + "18",
                          borderColor: p.color + (active ? "ff" : "55"),
                        },
                      ]}>
                      <Icon
                        size={12}
                        color={active ? "#fff" : p.color}
                        strokeWidth={2.5}
                      />
                      <Text
                        style={[
                          styles.priorityPickText,
                          { color: active ? "#fff" : p.color },
                        ]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {isEmpty && (
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIconBg,
                { backgroundColor: colors.primary + "15" },
              ]}>
              <Sparkles size={48} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              All clear!
            </Text>
            <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
              You have no tasks yet.{"\n"}Tap above to create your first one.
            </Text>
          </View>
        )}

        {todo.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionDot, { backgroundColor: colors.primary }]}
              />
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                TO DO
              </Text>
              <View
                style={[
                  styles.sectionCount,
                  { backgroundColor: colors.primary + "20" },
                ]}>
                <Text
                  style={[styles.sectionCountText, { color: colors.primary }]}>
                  {todo.length}
                </Text>
              </View>
            </View>
            <View style={styles.taskList}>
              {todo.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onEdit={() => openEdit(task)}
                />
              ))}
            </View>
          </>
        )}

        {done.length > 0 && (
          <>
            <TouchableOpacity
              onPress={() => setCompletedCollapsed((v) => !v)}
              style={styles.sectionHeader}
              activeOpacity={0.7}>
              <View
                style={[styles.sectionDot, { backgroundColor: "#10B981" }]}
              />
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                COMPLETED
              </Text>
              <View
                style={[styles.sectionCount, { backgroundColor: "#10B98120" }]}>
                <Text style={[styles.sectionCountText, { color: "#10B981" }]}>
                  {done.length}
                </Text>
              </View>
              <View style={{ flex: 1 }} />
              {completedCollapsed ? (
                <ChevronRight size={14} color={colors.textMuted} />
              ) : (
                <ChevronDown size={14} color={colors.textMuted} />
              )}
            </TouchableOpacity>
            {!completedCollapsed && (
              <View style={styles.taskList}>
                {done.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => openEdit(task)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={editModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setEditModal(false)}>
          <Pressable
            style={[
              styles.modalSheet,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}>
            <View
              style={[styles.modalHandle, { backgroundColor: colors.border }]}
            />

            <View style={styles.modalTitleRow}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Edit Task
              </Text>
              <TouchableOpacity
                onPress={() => setEditModal(false)}
                style={[
                  styles.modalCloseBtn,
                  { backgroundColor: colors.background },
                ]}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
              TITLE
            </Text>
            <TextInput
              style={[
                styles.formInput,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Task title"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
              NOTE
            </Text>
            <TextInput
              style={[
                styles.formInput,
                styles.formInputMulti,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              value={editNote}
              onChangeText={setEditNote}
              placeholder="Optional note..."
              placeholderTextColor={colors.textMuted}
              multiline
            />

            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
              PRIORITY
            </Text>
            <View style={styles.priorityPickerRow}>
              {PRIORITIES.map((p) => {
                const Icon = p.icon;
                const active = editPriority === p.key;
                return (
                  <TouchableOpacity
                    key={p.key}
                    onPress={() => setEditPriority(p.key)}
                    activeOpacity={0.8}
                    style={[
                      styles.priorityPickBtn,
                      styles.priorityPickBtnLg,
                      {
                        backgroundColor: active ? p.color : p.color + "18",
                        borderColor: p.color + (active ? "ff" : "55"),
                      },
                    ]}>
                    <Icon
                      size={14}
                      color={active ? "#fff" : p.color}
                      strokeWidth={2.5}
                    />
                    <Text
                      style={[
                        styles.priorityPickText,
                        { color: active ? "#fff" : p.color, fontSize: 13 },
                      ]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                onPress={() => setEditModal(false)}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.modalBtnText,
                    { color: colors.textSecondary },
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                style={[
                  styles.modalBtn,
                  styles.modalBtnSave,
                  { backgroundColor: colors.primary },
                ]}>
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "900" },
  clearDoneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  clearDoneText: { color: "#EF4444", fontSize: 12, fontWeight: "800" },
  heroCard: {
    borderRadius: 32,
    backgroundColor: "#6366F1",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    overflow: "hidden",
  },
  heroLeft: { flex: 1, marginRight: 16 },
  heroLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  heroStats: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  heroStat: { flex: 1, alignItems: "center" },
  heroStatNum: { color: "white", fontSize: 28, fontWeight: "900" },
  heroStatLbl: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  heroProgressBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  heroProgressFill: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 3,
  },
  heroProgressLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },
  addPanel: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginBottom: 28,
    gap: 12,
  },
  addRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  addInput: { flex: 1, fontSize: 16, fontWeight: "600", paddingVertical: 4 },
  addFab: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addExtra: { gap: 12 },
  noteInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
  },
  priorityPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  priorityPickerLabel: { fontSize: 12, fontWeight: "700" },
  priorityPickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  priorityPickBtnLg: { flex: 1, justifyContent: "center" },
  priorityPickText: { fontSize: 11, fontWeight: "800" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionDot: { width: 7, height: 7, borderRadius: 4 },
  sectionTitle: { fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  sectionCount: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  sectionCountText: { fontSize: 11, fontWeight: "800" },
  taskList: { gap: 10, marginBottom: 28 },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    gap: 14,
    paddingBottom: 20,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 26, fontWeight: "900" },
  emptyBody: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    paddingBottom: 40,
    gap: 14,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: { fontSize: 22, fontWeight: "900" },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  formLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  formInput: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    fontWeight: "600",
  },
  formInputMulti: { minHeight: 80, textAlignVertical: "top" },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 4 },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
  },
  modalBtnSave: { borderWidth: 0 },
  modalBtnText: { fontSize: 15, fontWeight: "800" },
});
