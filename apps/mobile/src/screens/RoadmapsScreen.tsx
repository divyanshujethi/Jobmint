import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { CAREER_ROADMAPS, CareerRoadmap } from "@repo/shared";

export const RoadmapsScreen: React.FC = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<CareerRoadmap>(CAREER_ROADMAPS[0]);

  return (
    <View style={styles.container}>
      {/* Category Horizontal Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CAREER_ROADMAPS.map((roadmap) => {
          const isSelected = selectedRoadmap.slug === roadmap.slug;
          return (
            <TouchableOpacity
              key={roadmap.slug}
              style={[styles.categoryPill, isSelected && styles.activePill]}
              onPress={() => setSelectedRoadmap(roadmap)}
            >
              <Text style={[styles.categoryText, isSelected && styles.activeCategoryText]}>
                {roadmap.category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Roadmap Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.badgeRow}>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>100% Free Resources</Text>
            </View>
            <Text style={styles.levelText}>{selectedRoadmap.level}</Text>
          </View>

          <Text style={styles.roadmapTitle}>{selectedRoadmap.title}</Text>
          <Text style={styles.roadmapDesc}>{selectedRoadmap.shortDescription}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>⏱️ {selectedRoadmap.durationWeeks}</Text>
            <Text style={styles.metaItem}>📚 {selectedRoadmap.phases.length} Core Phases</Text>
          </View>
        </View>

        {/* Phase Modules Accordion */}
        <Text style={styles.curriculumHeader}>Curated Learning Path</Text>

        {selectedRoadmap.phases.map((phase) => (
          <View key={phase.phaseNumber} style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <View style={styles.phaseNumberBadge}>
                <Text style={styles.phaseNumberText}>Phase {phase.phaseNumber}</Text>
              </View>
              <Text style={styles.phaseTitle}>{phase.title}</Text>
            </View>

            <Text style={styles.phaseDesc}>{phase.description}</Text>

            {/* Skills learned */}
            <View style={styles.skillsRow}>
              {phase.skills.map((skill) => (
                <View key={skill} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>

            {/* Free Resources */}
            <View style={styles.resourcesSection}>
              <Text style={styles.resourcesHeader}>Free Verified Courses & Guides:</Text>
              {phase.resources.map((res, i) => (
                <View key={i} style={styles.resourceItem}>
                  <Text style={styles.resourceProvider}>[{res.provider}]</Text>
                  <Text style={styles.resourceTitle}>{res.title}</Text>
                  <Text style={styles.resourceHours}>{res.estimatedHours}h</Text>
                </View>
              ))}
            </View>

            {/* Capstone Project Idea */}
            {phase.projectIdea && (
              <View style={styles.projectCard}>
                <Text style={styles.projectTitle}>
                  🛠️ Capstone Project: {phase.projectIdea.title}
                </Text>
                <Text style={styles.projectDesc}>{phase.projectIdea.description}</Text>
              </View>
            )}
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
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8
  },
  categoryPill: {
    backgroundColor: "#121215",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#27272a"
  },
  activePill: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "#10b981"
  },
  categoryText: {
    color: "#a1a1aa",
    fontSize: 12,
    fontWeight: "600"
  },
  activeCategoryText: {
    color: "#34d399",
    fontWeight: "bold"
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32
  },
  bannerCard: {
    backgroundColor: "#121215",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  freeBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  freeBadgeText: {
    color: "#10b981",
    fontSize: 10,
    fontWeight: "bold"
  },
  levelText: {
    color: "#71717a",
    fontSize: 11
  },
  roadmapTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },
  roadmapDesc: {
    color: "#a1a1aa",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#1c1c20"
  },
  metaItem: {
    color: "#d4d4d8",
    fontSize: 11,
    fontWeight: "500"
  },
  curriculumHeader: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
  phaseCard: {
    backgroundColor: "#121215",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f1f23"
  },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  phaseNumberBadge: {
    backgroundColor: "#27272a",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  phaseNumberText: {
    color: "#10b981",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace"
  },
  phaseTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1
  },
  phaseDesc: {
    color: "#a1a1aa",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10
  },
  skillTag: {
    backgroundColor: "#1c1c20",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  skillTagText: {
    color: "#71717a",
    fontSize: 10,
    fontFamily: "monospace"
  },
  resourcesSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#1c1c20"
  },
  resourcesHeader: {
    color: "#d4d4d8",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4
  },
  resourceProvider: {
    color: "#10b981",
    fontSize: 10,
    fontWeight: "600",
    marginRight: 6
  },
  resourceTitle: {
    color: "#e4e4e7",
    fontSize: 11,
    flex: 1
  },
  resourceHours: {
    color: "#71717a",
    fontSize: 10,
    fontFamily: "monospace"
  },
  projectCard: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 8,
    padding: 10,
    marginTop: 10
  },
  projectTitle: {
    color: "#34d399",
    fontSize: 11,
    fontWeight: "bold"
  },
  projectDesc: {
    color: "#a1a1aa",
    fontSize: 10,
    marginTop: 2,
    lineHeight: 15
  }
});