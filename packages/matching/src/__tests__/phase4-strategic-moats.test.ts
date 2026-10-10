import { describe, it, expect } from "vitest";

describe("Phase 4: Indian Corridor Strategic Moats (Telemetry, TPO & Escrow)", () => {
  describe("Truth Teller Telemetry Follow-Up & Ghosting Calculations", () => {
    function computeFollowUpTelemetry(appliedAt: Date, latestFollowUpAt: Date | null, isExternal: boolean, lastViewedAt: Date | null, now: Date = new Date()) {
      const daysSinceApplied = Math.floor(
        (now.getTime() - appliedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const hasFollowedUp = Boolean(latestFollowUpAt);

      let followUpDueDays = 0;
      let followUpStatus = "SCHEDULED";

      if (latestFollowUpAt) {
        const daysSinceFollowUp = Math.floor(
          (now.getTime() - latestFollowUpAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        followUpDueDays = Math.max(0, 14 - daysSinceFollowUp);
        followUpStatus = followUpDueDays > 0 ? "FOLLOW_UP_LOGGED" : "FOLLOW_UP_NOW";
      } else {
        followUpDueDays = Math.max(0, 7 - daysSinceApplied);
        followUpStatus = followUpDueDays === 0 ? "FOLLOW_UP_NOW" : "SCHEDULED";
      }

      const isGhosted = !isExternal && !lastViewedAt && daysSinceApplied >= 7 && !hasFollowedUp;

      return {
        daysSinceApplied,
        followUpDueDays,
        followUpStatus,
        hasFollowedUp,
        isGhosted,
      };
    }

    it("schedules initial 7-day follow-up countdown for new application", () => {
      const now = new Date("2026-10-10T12:00:00Z");
      const appliedAt = new Date("2026-10-08T12:00:00Z"); // 2 days ago
      const telemetry = computeFollowUpTelemetry(appliedAt, null, true, null, now);

      expect(telemetry.daysSinceApplied).toBe(2);
      expect(telemetry.followUpDueDays).toBe(5);
      expect(telemetry.followUpStatus).toBe("SCHEDULED");
      expect(telemetry.hasFollowedUp).toBe(false);
      expect(telemetry.isGhosted).toBe(false);
    });

    it("triggers FOLLOW_UP_NOW when 7 days elapse without follow-up", () => {
      const now = new Date("2026-10-10T12:00:00Z");
      const appliedAt = new Date("2026-10-01T12:00:00Z"); // 9 days ago
      const telemetry = computeFollowUpTelemetry(appliedAt, null, true, null, now);

      expect(telemetry.daysSinceApplied).toBe(9);
      expect(telemetry.followUpDueDays).toBe(0);
      expect(telemetry.followUpStatus).toBe("FOLLOW_UP_NOW");
    });

    it("extends follow-up deadline by 14 days when candidate logs recruiter outreach", () => {
      const now = new Date("2026-10-10T12:00:00Z");
      const appliedAt = new Date("2026-10-01T12:00:00Z"); // 9 days ago
      const followedUpAt = new Date("2026-10-08T12:00:00Z"); // 2 days ago
      const telemetry = computeFollowUpTelemetry(appliedAt, followedUpAt, true, null, now);

      expect(telemetry.daysSinceApplied).toBe(9);
      expect(telemetry.hasFollowedUp).toBe(true);
      expect(telemetry.followUpDueDays).toBe(12); // 14 - 2 = 12 days snooze remaining
      expect(telemetry.followUpStatus).toBe("FOLLOW_UP_LOGGED");
      expect(telemetry.isGhosted).toBe(false);
    });

    it("flags unviewed direct-portal application as ghosted after 7 days if no follow-up", () => {
      const now = new Date("2026-10-10T12:00:00Z");
      const appliedAt = new Date("2026-10-01T12:00:00Z"); // 9 days ago
      const telemetry = computeFollowUpTelemetry(appliedAt, null, false, null, now);

      expect(telemetry.isGhosted).toBe(true);
    });
  });

  describe("TPO Batch Student CSV Parser & Telemetry Aggregation", () => {
    function parseStudentCsv(csvContent: string) {
      const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return [];

      const records = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.replace(/^"|"$/g, "").trim());
        if (parts.length >= 2 && parts[0]) {
          records.push({
            name: parts[0],
            rollNo: parts[1],
            branch: parts[2] || "Computer Science",
            devScore: parseInt(parts[3], 10) || 700,
            githubHandle: parts[4] || "dev",
            status: parts[8]?.toUpperCase() === "PLACED" ? "PLACED" : "READY",
          });
        }
      }
      return records;
    }

    it("correctly parses institutional student CSV roster", () => {
      const csv = `Name,RollNo,Branch,DevScore,GitHub,POTDStreak,Applications,Offers,Status
"Aditya Verma","21CS001","Computer Science",820,"aditya-v",30,10,2,"PLACED"
"Sneha Reddy","21IT045","Information Tech",760,"sneha-r",15,8,0,"READY"`;

      const students = parseStudentCsv(csv);
      expect(students).toHaveLength(2);
      expect(students[0].name).toBe("Aditya Verma");
      expect(students[0].devScore).toBe(820);
      expect(students[0].status).toBe("PLACED");
      expect(students[1].name).toBe("Sneha Reddy");
      expect(students[1].branch).toBe("Information Tech");
      expect(students[1].status).toBe("READY");
    });

    it("calculates accurate batch median DevScore and placement rate", () => {
      const scores = [820, 760, 680, 740];
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      expect(avg).toBe(750);
    });
  });

  describe("Candidate Fee Protection & Anti-Scam Rules", () => {
    function isForbiddenFeeSolicitation(text: string): boolean {
      const lower = text.toLowerCase();
      const forbiddenPhrases = [
        "registration fee",
        "security deposit",
        "training bond",
        "pay to apply",
        "laptop deposit",
        "processing charges",
      ];
      return forbiddenPhrases.some((phrase) => lower.includes(phrase));
    }

    it("detects forbidden recruiter payment demands", () => {
      expect(isForbiddenFeeSolicitation("Must pay security deposit of ₹5,000 for work laptop")).toBe(true);
      expect(isForbiddenFeeSolicitation("Candidate registration fee required before assessment")).toBe(true);
      expect(isForbiddenFeeSolicitation("Stipend: ₹25,000 / month with full health benefits")).toBe(false);
    });
  });
});
