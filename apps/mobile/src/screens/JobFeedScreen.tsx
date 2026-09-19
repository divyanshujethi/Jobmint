import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { MobileJob } from "../types";
import { JobCard } from "../components/JobCard";

interface JobFeedScreenProps {
  jobs: MobileJob[];
  onSelectJob: (job: MobileJob) => void;
  internshipOnly?: boolean;
}

export const JobFeedScreen: React.FC<JobFeedScreenProps> = ({
  jobs,
  onSelectJob,
  internshipOnly = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "REMOTE" | "HIGH_MATCH">("ALL");

  const filteredJobs = jobs.filter((job) => {
    if (internshipOnly && job.jobType !== "INTERNSHIP") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.companyName.toLowerCase().includes(q);
      const matchSkill = job.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkill) return false;
    }

    if (selectedFilter === "REMOTE" && job.workMode !== "REMOTE") return false;
    if (selectedFilter === "HIGH_MATCH") {
      const score = job.matchScore
        ? Math.round(
            job.matchScore.skills.score +
            job.matchScore.experience.score +
            job.matchScore.projects.score +
            job.matchScore.location.score +
            job.matchScore.education.score +
            job.matchScore.preferences.score
          )
        : 0;
      if (score < 75) return false;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by role, skill (React, Python), or company..."
          placeholderTextColor="#71717a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, selectedFilter === "ALL" && styles.activeChip]}
          onPress={() => setSelectedFilter("ALL")}
        >
          <Text style={[styles.chipText, selectedFilter === "ALL" && styles.activeChipText]}>
            All ({internshipOnly ? "Internships" : "Roles"})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, selectedFilter === "REMOTE" && styles.activeChip]}
          onPress={() => setSelectedFilter("REMOTE")}
        >
          <Text style={[styles.chipText, selectedFilter === "REMOTE" && styles.activeChipText]}>
            🌐 Remote Only
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, selectedFilter === "HIGH_MATCH" && styles.activeChip]}
          onPress={() => setSelectedFilter("HIGH_MATCH")}
        >
          <Text style={[styles.chipText, selectedFilter === "HIGH_MATCH" && styles.activeChipText]}>
            🔥 High Fit (75%+)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Jobs Scroll Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Showing {filteredJobs.length} verified openings
          </Text>
          <Text style={styles.zeroCostNote}>100% Free • No paywalls</Text>
        </View>

        {filteredJobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No matching jobs found</Text>
            <Text style={styles.emptySubtitle}>Try changing your filter or search keyword.</Text>
          </View>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => onSelectJob(job)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b"
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8
  },
  searchInput: {
    backgroundColor: "#18181b",
    color: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#27272a"
  },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10
  },
  chip: {
    backgroundColor: "#121215",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#27272a"
  },
  activeChip: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "#10b981"
  },
  chipText: {
    color: "#a1a1aa",
    fontSize: 11,
    fontWeight: "500"
  },
  activeChipText: {
    color: "#34d399",
    fontWeight: "700"
  },
  scrollContent: {
    paddingBottom: 32
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  resultsCount: {
    color: "#71717a",
    fontSize: 11,
    fontWeight: "600"
  },
  zeroCostNote: {
    color: "#10b981",
    fontSize: 10,
    fontWeight: "600"
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600"
  },
  emptySubtitle: {
    color: "#71717a",
    fontSize: 12,
    marginTop: 4
  }
});