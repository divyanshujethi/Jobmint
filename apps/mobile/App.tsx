import React, { useState } from "react";
import { View, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { MobileTab, MobileJob } from "./src/types";
import { MOCK_MOBILE_JOBS } from "./src/mock-data";
import { Header } from "./src/components/Header";
import { TabBar } from "./src/components/TabBar";
import { JobFeedScreen } from "./src/screens/JobFeedScreen";
import { JobDetailsScreen } from "./src/screens/JobDetailsScreen";
import { RoadmapsScreen } from "./src/screens/RoadmapsScreen";
import { ApplicationsScreen } from "./src/screens/ApplicationsScreen";
import { ResumeAssistantScreen } from "./src/screens/ResumeAssistantScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>("jobs");
  const [selectedJob, setSelectedJob] = useState<MobileJob | null>(null);

  const getHeaderInfo = (): { title: string; subtitle: string } => {
    if (selectedJob) {
      return { title: selectedJob.companyName, subtitle: "Verified Opening & Match Details" };
    }

    switch (activeTab) {
      case "jobs":
        return { title: "Explore Roles", subtitle: "Transparent fresher & early-career jobs" };
      case "internships":
        return { title: "Paid Internships", subtitle: "Zero-experience verified student opportunities" };
      case "roadmaps":
        return { title: "Free Roadmaps", subtitle: "Curated zero-cost paths: Karpathy, CS50, Fast.ai" };
      case "applications":
        return { title: "My Applications", subtitle: "7-Day Truth Teller Ghosting Tracker" };
      case "assistant":
        return { title: "Resume AI", subtitle: "ATS Bullet Optimizer & Action Verbs" };
      default:
        return { title: "JobMint", subtitle: "Transparency Job Platform" };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      <View style={styles.container}>
        {/* Persistent Brand & Telemetry Header */}
        <Header title={title} subtitle={subtitle} />

        {/* Dynamic Body Screen */}
        <View style={styles.body}>
          {selectedJob ? (
            <JobDetailsScreen
              job={selectedJob}
              onBack={() => setSelectedJob(null)}
              onGoToRoadmaps={() => {
                setSelectedJob(null);
                setActiveTab("roadmaps");
              }}
            />
          ) : (
            <>
              {activeTab === "jobs" && (
                <JobFeedScreen
                  jobs={MOCK_MOBILE_JOBS}
                  onSelectJob={(job: MobileJob) => setSelectedJob(job)}
                  internshipOnly={false}
                />
              )}
              {activeTab === "internships" && (
                <JobFeedScreen
                  jobs={MOCK_MOBILE_JOBS}
                  onSelectJob={(job: MobileJob) => setSelectedJob(job)}
                  internshipOnly={true}
                />
              )}
              {activeTab === "roadmaps" && <RoadmapsScreen />}
              {activeTab === "applications" && <ApplicationsScreen />}
              {activeTab === "assistant" && <ResumeAssistantScreen />}
            </>
          )}
        </View>

        {/* Bottom Tab Bar */}
        <TabBar
          activeTab={activeTab}
          onSelectTab={(tab: MobileTab) => {
            setSelectedJob(null);
            setActiveTab(tab);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#09090b"
  },
  container: {
    flex: 1,
    backgroundColor: "#09090b"
  },
  body: {
    flex: 1
  }
});