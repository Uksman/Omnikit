import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Shield, Lock, Eye, FileText, Mail } from "lucide-react-native";
import { useAppTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";

const PolicySection = ({ icon: Icon, title, content }) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.section}>
      {[
        <View key="head" style={styles.sectionHeader}>
          {[
            <View
              key="icon"
              style={[
                styles.iconContainer,
                { backgroundColor: "rgba(99, 102, 241, 0.1)" },
              ]}
            >
              <Icon size={20} color={colors.primary} />
            </View>,
            <Text
              key="title"
              style={[styles.sectionTitle, { color: colors.textPrimary }]}
            >
              {title}
            </Text>,
          ]}
        </View>,
        <Text
          key="body"
          style={[styles.sectionContent, { color: colors.textSecondary }]}
        >
          {content}
        </Text>,
      ]}
    </View>
  );
};

export default function PrivacyPolicy() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "Omnikit is designed with privacy in mind. We collect minimal data necessary to provide our utility services. This includes transaction history for your own reference, which is stored locally on your device unless you choose to export it."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "Your data's security is our priority. All local data is encrypted using industry-standard protocols. We do not transmit your personal utility data to external servers without your explicit consent (e.g., when using cloud-based currency conversion)."
    },
    {
      icon: Shield,
      title: "Third-Party Services",
      content: "We use trusted third-party APIs for currency exchange rates and maps. These services may collect anonymous usage data to improve their offerings. We recommend reviewing their respective privacy policies."
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: "You have full control over your data. You can clear your history, export your data, or reset app settings at any time from the app's settings menu. We do not sell or share your personal information with advertisers."
    },
    {
      icon: Mail,
      title: "Contact Us",
      content: "If you have any questions or concerns about our privacy practices, please contact our support team at support@omnikit.app. We are committed to transparency and will respond to your inquiries promptly."
    }
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {[
        <View key="header" style={styles.header}>
          {[
            <TouchableOpacity
              key="back"
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <ChevronLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>,
            <Text
              key="title"
              style={[styles.headerTitle, { color: colors.textPrimary }]}
            >
              Privacy Policy
            </Text>,
            <View key="spacer" style={styles.headerSpacer} />,
          ]}
        </View>,
        <ScrollView
          key="scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[
            <View
              key="hero"
              style={[styles.heroCard, { backgroundColor: colors.primary }]}
            >
              {[
                <Shield
                  key="shield"
                  size={64}
                  color="white"
                  style={styles.heroIcon}
                />,
                <Text key="heroTitle" style={styles.heroTitle}>
                  Your Privacy Matters
                </Text>,
                <Text key="heroSub" style={styles.heroSubtitle}>
                  Last updated: April 11, 2026
                </Text>,
              ]}
            </View>,
            <View key="body" style={styles.contentContainer}>
              {[
                <Text
                  key="intro"
                  style={[styles.introText, { color: colors.textSecondary }]}
                >
                  At Omnikit, we believe privacy is a fundamental right. This
                  policy outlines how we handle your data and our commitment to
                  keeping your information secure.
                </Text>,
                ...sections.map((section, index) => (
                  <PolicySection
                    key={index}
                    icon={section.icon}
                    title={section.title}
                    content={section.content}
                  />
                )),
                <Text
                  key="footer"
                  style={[styles.footerText, { color: colors.textMuted }]}
                >
                  By using Omnikit, you agree to the terms outlined in this
                  Privacy Policy. We may update this policy from time to time,
                  and we encourage you to check back periodically.
                </Text>,
              ]}
            </View>,
          ]}
        </ScrollView>,
      ]}
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
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    margin: 20,
    borderRadius: 32,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: {
    marginBottom: 15,
    opacity: 0.9,
  },
  heroTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 5,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  contentContainer: {
    paddingHorizontal: 25,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  footerText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    lineHeight: 20,
  },
});
