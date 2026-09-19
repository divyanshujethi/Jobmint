import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MobileJob } from "../types";
import { MatchBadge } from "./MatchBadge";

interface JobCardProps {
  job: MobileJob;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={styles.companyRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{job.companyLogoInitial}</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.companyName}>{job.companyName}</Text>
              {job.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.locationText}>{job.location} • {job.workMode}</Text>
          </View>
        </View>

        <MatchBadge breakdown={job.matchScore} />
      </View>

      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.stipend}>{job.salaryOrStipend}</Text>

      {/* Skills tags */}
      <View style={styles.skillsRow}>
        {job.skills.slice(0, 3).map((skill) => (
          <View key={skill} style={styles.skillPill}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {job.skills.length > 3 && (
          <Text style={styles.moreSkillsText}>+{job.skills.length - 3} more</Text>
        )}
      </View>

      {/* Truth Teller Footer */}
      <View style={styles.truthFooter}>
        <View style={styles.truthMetric}>
          <Text style={styles.truthLabel}>Review Rate</Text>
          <Text style={styles.truthValue}>{job.truthTeller.reviewRate}%</Text>
        </View>
        <View style={styles.truthDivider} />
        <View style={styles.truthMetric}>
          <Text style={styles.truthLabel}>First Review</Text>
          <Text style={styles.truthValue}>{job.truthTeller.medianFirstReviewDays}d</Text>
        </View>
        <View style={styles.truthDivider} />
        <View style={styles.ghostPledge}>
          <Text style={styles.ghostText}>🛡️ 7-Day Ghost Shield</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#121215",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#27272a",
    justifyContent: "center",
    alignItems: "center"
  },
  avatarText: {
    color: "#f4f4f5",
    fontWeight: "bold",
    fontSize: 16
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  companyName: {
    color: "#e4e4e7",
    fontSize: 13,
    fontWeight: "600"
  },
  verifiedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6
  },
  verifiedText: {
    color: "#10b981",
    fontSize: 9,
    fontWeight: "bold"
  },
  locationText: {
    color: "#71717a",
    fontSize: 11,
    marginTop: 2
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12
  },
  stipend: {
    color: "#10b981",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
    alignItems: "center"
  },
  skillPill: {
    backgroundColor: "#1c1c20",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#27272a"
  },
  skillText: {
    color: "#a1a1aa",
    fontSize: 11,
    fontFamily: "monospace"
  },
  moreSkillsText: {
    color: "#71717a",
    fontSize: 11
  },
  truthFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#09090b",
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#18181b"
  },
  truthMetric: {
    alignItems: "center"
  },
  truthLabel: {
    color: "#71717a",
    fontSize: 9,
    textTransform: "uppercase"
  },
  truthValue: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 1
  },
  truthDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#27272a"
  },
  ghostPledge: {
    alignItems: "center"
  },
  ghostText: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "600"
  }
});