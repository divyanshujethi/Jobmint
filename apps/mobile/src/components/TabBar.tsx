import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MobileTab } from "../types";

interface TabBarProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: MobileTab; label: string; icon: string }[] = [
    { id: "jobs", label: "Jobs", icon: "💼" },
    { id: "internships", label: "Internships", icon: "🎓" },
    { id: "roadmaps", label: "Roadmaps", icon: "🗺️" },
    { id: "applications", label: "Tracker", icon: "🛡️" },
    { id: "assistant", label: "Resume AI", icon: "✨" }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#09090b",
    borderTopWidth: 1,
    borderTopColor: "#1f1f23",
    paddingBottom: 24,
    paddingTop: 10,
    justifyContent: "space-around"
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  activeTabButton: {
    backgroundColor: "rgba(16, 185, 129, 0.08)"
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#71717a"
  },
  activeTabLabel: {
    color: "#10b981",
    fontWeight: "700"
  }
});