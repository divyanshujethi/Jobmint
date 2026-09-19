import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MatchScoreBreakdown } from "@repo/matching";

interface MatchBadgeProps {
  breakdown?: MatchScoreBreakdown;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ breakdown }) => {
  if (!breakdown) return null;

  const totalScore = Math.round(
    breakdown.skills.score +
    breakdown.experience.score +
    breakdown.projects.score +
    breakdown.location.score +
    breakdown.education.score +
    breakdown.preferences.score
  );

  const getBadgeStyle = (score: number) => {
    if (score >= 80) return { bg: "rgba(16, 185, 129, 0.15)", border: "#10b981", text: "#34d399", emoji: "🔥" };
    if (score >= 60) return { bg: "rgba(245, 158, 11, 0.15)", border: "#f59e0b", text: "#fbbf24", emoji: "⚡" };
    return { bg: "rgba(113, 113, 122, 0.15)", border: "#71717a", text: "#a1a1aa", emoji: "🎯" };
  };

  const style = getBadgeStyle(totalScore);

  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={styles.emoji}>{style.emoji}</Text>
      <Text style={[styles.scoreText, { color: style.text }]}>
        {totalScore}% Match
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4
  },
  emoji: {
    fontSize: 11
  },
  scoreText: {
    fontSize: 11,
    fontWeight: "700"
  }
});