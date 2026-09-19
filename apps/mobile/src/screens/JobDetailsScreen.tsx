import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MobileJob } from "../types";
import { MatchBadge } from "../components/MatchBadge";

interface JobDetailsScreenProps {
  job: MobileJob;
  onBack: () => void;
  onGoToRoadmaps: () => void;
}

export const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({
  job,
  onBack,
  onGoToRoadmaps
}) => {
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = () => {
    setHasApplied(true);
    Alert.alert(
      "Application Submitted! 🚀",
      `Your verified resume and profile have been delivered to ${job.companyName}.\n\nTruth Teller Guarantee: If the employer does not review your application within 7 days, we will alert you and suggest similar openings.`,
      [{ text: "Track Status", onPress: onBack }]
    );
  };

  const totalMatchScore = job.matchScore
    ? Math.round(
        job.matchScore.skills.score +
        job.matchScore.experience.score +
        job.matchScore.projects.score +
        job.matchScore.location.score +
        job.matchScore.education.score +
        job.matchScore.preferences.score
      )
    : 85;

  return (
    <View style={styles.container}>
      {/* Top Bar with Back Button */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back to Openings</Text>
        </TouchableOpacity>
        <MatchBadge breakdown={job.matchScore} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{job.companyLogoInitial}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.companyName}>{job.companyName}</Text>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.stipend}>{job.salaryOrStipend}</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Work Mode</Text>
              <Text style={styles.metricValue}>{job.workMode}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Location</Text>
              <Text style={styles.metricValue}>{job.location}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Experience</Text>
              <Text style={styles.metricValue}>
                {job.experienceYears === 0 ? "Fresher (0 yr)" : `${job.experienceYears}+ yrs`}
              </Text>
            </View>
          </View>
        </View>

        {/* Deterministic Fit Breakdown Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Candidate Fit Breakdown</Text>
            <Text style={styles.scorePill}>{totalMatchScore}% Match</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Pure mathematical scoring across 6 transparent criteria:
          </Text>

          {job.matchScore && (
            <View style={styles.factorsList}>
              <View style={styles.factorRow}>
                <Text style={styles.factorName}>Skills Match (35%)</Text>
                <Text style={styles.factorScore}>{job.matchScore.skills.score} / 35</Text>
              </View>
              <View style={styles.factorRow}>
                <Text style={styles.factorName}>Experience Fit (20%)</Text>
                <Text style={styles.factorScore}>{job.matchScore.experience.score} / 20</Text>
              </View>
              <View style={styles.factorRow}>
                <Text style={styles.factorName}>Relevant Projects (15%)</Text>
                <Text style={styles.factorScore}>{job.matchScore.projects.score} / 15</Text>
              </View>
              <View style={styles.factorRow}>
                <Text style={styles.factorName}>Location & Work Mode (10%)</Text>
                <Text style={styles.factorScore}>{job.matchScore.location.score} / 10</Text>
              </View>
              <View style={styles.factorRow}>
                <Text style={styles.factorName}>Education Level (10%)</Text>
                <Text style={styles.factorScore}>{job.matchScore.education.score} / 10</Text>
              </View>
              <View style={styles.factorRow}>
                <Text style={styles.factorName}>Preferences (10%)</Text>
                <Text style={styles.factorScore}>{job.matchScore.preferences.score} / 10</Text>
              </View>
            </View>
          )}

          {/* Missing Skills Bridge */}
          {job.matchScore && job.matchScore.skills.missingSkills.length > 0 && (
            <View style={styles.missingSkillsCard}>
              <Text style={styles.missingSkillsTitle}>
                Bridge Missing Skills ({job.matchScore.skills.missingSkills.join(", ")}):
              </Text>
              <Text style={styles.missingSkillsBody}>
                Don't let missing skills stop you. Follow our 100% free curated roadmaps to build projects and boost your score.
              </Text>
              <TouchableOpacity
                style={styles.roadmapLinkButton}
                onPress={onGoToRoadmaps}
              >
                <Text style={styles.roadmapLinkText}>Open Free Learning Roadmaps →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Truth Teller Transparency Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🛡️ Truth Teller Transparency</Text>
          <Text style={styles.sectionSubtitle}>
            Audited platform metrics recorded for {job.companyName}:
          </Text>

          <View style={styles.truthGrid}>
            <View style={styles.truthBox}>
              <Text style={styles.truthBoxLabel}>Review Rate</Text>
              <Text style={styles.truthBoxValue}>{job.truthTeller.reviewRate}%</Text>
            </View>
            <View style={styles.truthBox}>
              <Text style={styles.truthBoxLabel}>Median First Review</Text>
              <Text style={styles.truthBoxValue}>{job.truthTeller.medianFirstReviewDays} Days</Text>
            </View>
          </View>

          <View style={styles.ghostBanner}>
            <Text style={styles.ghostBannerText}>
              🛡️ Ghosting Protection: If the employer does not review your application within 7 days, JobMint automatically flags inactivity and alerts you.
            </Text>
          </View>
        </View>

        {/* About the Role */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About the Role</Text>
          <Text style={styles.bodyText}>{job.description}</Text>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Key Responsibilities</Text>
          {job.responsibilities.map((r, i) => (
            <Text key={i} style={styles.listItem}>• {r}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Requirements</Text>
          {job.requirements.map((req, i) => (
            <Text key={i} style={styles.listItem}>• {req}</Text>
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Apply Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.applyButton, hasApplied && styles.appliedButton]}
          onPress={handleApply}
          disabled={hasApplied}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>
            {hasApplied ? "✓ Application Submitted" : "⚡ 1-Click Apply with Resume"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b"
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f23"
  },
  backButton: {
    paddingVertical: 4
  },
  backText: {
    color: "#a1a1aa",
    fontSize: 13,
    fontWeight: "500"
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90
  },
  headerCard: {
    backgroundColor: "#121215",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#27272a",
    justifyContent: "center",
    alignItems: "center"
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold"
  },
  headerInfo: {
    flex: 1
  },
  companyName: {
    color: "#a1a1aa",
    fontSize: 12,
    fontWeight: "500"
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2
  },
  stipend: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#1f1f23"
  },
  metricItem: {
    alignItems: "flex-start"
  },
  metricLabel: {
    color: "#71717a",
    fontSize: 10,
    textTransform: "uppercase"
  },
  metricValue: {
    color: "#e4e4e7",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2
  },
  sectionCard: {
    backgroundColor: "#121215",
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold"
  },
  sectionSubtitle: {
    color: "#71717a",
    fontSize: 11,
    marginTop: 4,
    marginBottom: 10
  },
  scorePill: {
    color: "#34d399",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  factorsList: {
    gap: 8,
    marginTop: 4
  },
  factorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c20"
  },
  factorName: {
    color: "#a1a1aa",
    fontSize: 12
  },
  factorScore: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "monospace"
  },
  missingSkillsCard: {
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.25)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 14
  },
  missingSkillsTitle: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "bold"
  },
  missingSkillsBody: {
    color: "#d4d4d8",
    fontSize: 11,
    marginTop: 3,
    lineHeight: 16
  },
  roadmapLinkButton: {
    marginTop: 8,
    paddingVertical: 4
  },
  roadmapLinkText: {
    color: "#34d399",
    fontSize: 11,
    fontWeight: "bold"
  },
  truthGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6
  },
  truthBox: {
    flex: 1,
    backgroundColor: "#09090b",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  truthBoxLabel: {
    color: "#71717a",
    fontSize: 10,
    textTransform: "uppercase"
  },
  truthBoxValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2
  },
  ghostBanner: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)"
  },
  ghostBannerText: {
    color: "#34d399",
    fontSize: 11,
    lineHeight: 16
  },
  bodyText: {
    color: "#d4d4d8",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6
  },
  listItem: {
    color: "#a1a1aa",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#09090b",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#1f1f23"
  },
  applyButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  appliedButton: {
    backgroundColor: "#27272a"
  },
  applyButtonText: {
    color: "#09090b",
    fontSize: 14,
    fontWeight: "bold"
  }
});