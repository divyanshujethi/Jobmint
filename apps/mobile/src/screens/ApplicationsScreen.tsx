import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { MOCK_MOBILE_APPLICATIONS } from "../mock-data";

export const ApplicationsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTitle}>🛡️ Truth Teller Application Shield</Text>
          <Text style={styles.bannerSubtitle}>
            Every employer action is timestamped. If any recruiter leaves your application unreviewed for 7 days, we alert you and suggest alternative openings.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>
          Your Active Applications ({MOCK_MOBILE_APPLICATIONS.length})
        </Text>

        {MOCK_MOBILE_APPLICATIONS.map((app) => (
          <View key={app.id} style={styles.appCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.jobTitle}>{app.jobTitle}</Text>
                <Text style={styles.companyName}>{app.companyName}</Text>
              </View>
              <View style={[styles.statusBadge, app.isGhostingWarning && styles.warningBadge]}>
                <Text style={[styles.statusText, app.isGhostingWarning && styles.warningStatusText]}>
                  {app.isGhostingWarning ? "⚠️ 7-Day Inactive" : app.status}
                </Text>
              </View>
            </View>

            {/* Ghosting Alert Banner */}
            {app.isGhostingWarning && (
              <View style={styles.ghostAlert}>
                <Text style={styles.ghostAlertText}>
                  ⚠️ Truth Teller Alert: Recruiter has not reviewed this submission in 9 days. We recommend applying to active alternative openings.
                </Text>
              </View>
            )}

            {/* Timeline Steps */}
            <View style={styles.timelineContainer}>
              {app.timeline.map((step, idx) => (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.timelineIndicatorCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        step.completed && styles.completedDot,
                        step.current && styles.currentDot
                      ]}
                    />
                    {idx < app.timeline.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          step.completed && styles.completedLine
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineStep, step.completed && styles.completedStep]}>
                      {step.step}
                    </Text>
                    <Text style={styles.timelineDate}>{step.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b"
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32
  },
  bannerCard: {
    backgroundColor: "#121215",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  bannerTitle: {
    color: "#34d399",
    fontSize: 14,
    fontWeight: "bold"
  },
  bannerSubtitle: {
    color: "#a1a1aa",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16
  },
  sectionHeader: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 10
  },
  appCard: {
    backgroundColor: "#121215",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold"
  },
  companyName: {
    color: "#71717a",
    fontSize: 12,
    marginTop: 2
  },
  statusBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)"
  },
  statusText: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "bold"
  },
  warningBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.3)"
  },
  warningStatusText: {
    color: "#f87171"
  },
  ghostAlert: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)"
  },
  ghostAlertText: {
    color: "#fca5a5",
    fontSize: 11,
    lineHeight: 16
  },
  timelineContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1c1c20"
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12
  },
  timelineIndicatorCol: {
    alignItems: "center",
    width: 20,
    marginRight: 10
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3f3f46"
  },
  completedDot: {
    backgroundColor: "#10b981"
  },
  currentDot: {
    backgroundColor: "#34d399",
    borderWidth: 2,
    borderColor: "#09090b"
  },
  timelineLine: {
    width: 1,
    height: 24,
    backgroundColor: "#27272a",
    marginTop: 2
  },
  completedLine: {
    backgroundColor: "#10b981"
  },
  timelineContent: {
    flex: 1
  },
  timelineStep: {
    color: "#71717a",
    fontSize: 12
  },
  completedStep: {
    color: "#ffffff",
    fontWeight: "600"
  },
  timelineDate: {
    color: "#52525b",
    fontSize: 10,
    marginTop: 1,
    fontFamily: "monospace"
  }
});