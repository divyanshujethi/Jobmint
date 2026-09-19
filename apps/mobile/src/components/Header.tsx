import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { APP_CONFIG } from "@repo/shared";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>J</Text>
          </View>
          <Text style={styles.brandName}>{APP_CONFIG.name}</Text>
        </View>

        <View style={styles.shieldBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.shieldText}>Truth Teller Active</Text>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#09090b",
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f23"
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center"
  },
  logoText: {
    color: "#09090b",
    fontWeight: "bold",
    fontSize: 16
  },
  brandName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: -0.5
  },
  shieldBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    gap: 6
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981"
  },
  shieldText: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "600"
  },
  titleSection: {
    marginTop: 12
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff"
  },
  subtitle: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2
  }
});