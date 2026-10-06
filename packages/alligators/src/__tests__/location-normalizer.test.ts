import { describe, it, expect } from "vitest";
import { normalizeIndiaLocation } from "../job-alligator/india-crawler";
import { WorkMode } from "@repo/shared";

describe("India Location Normalizer (normalizeIndiaLocation)", () => {
  it("normalizes major Indian tech hubs correctly", () => {
    const bengaluru = normalizeIndiaLocation("Bangalore, India");
    expect(bengaluru.isIndiaOrRemote).toBe(true);
    expect(bengaluru.location).toBe("Bengaluru, Karnataka, India");
    expect(bengaluru.workMode).toBe(WorkMode.ON_SITE);

    const gurgaon = normalizeIndiaLocation("Gurugram Cyber Hub");
    expect(gurgaon.isIndiaOrRemote).toBe(true);
    expect(gurgaon.location).toBe("Gurugram, Haryana, India");

    const noida = normalizeIndiaLocation("Noida Sector 62");
    expect(noida.isIndiaOrRemote).toBe(true);
    expect(noida.location).toBe("Noida, Uttar Pradesh, India");

    const hyderabad = normalizeIndiaLocation("HITEC City, Hyderabad");
    expect(hyderabad.isIndiaOrRemote).toBe(true);
    expect(hyderabad.location).toBe("Hyderabad, Telangana, India");
  });

  it("normalizes Tricity and regional clusters", () => {
    const chandigarh = normalizeIndiaLocation("Chandigarh, India");
    expect(chandigarh.isIndiaOrRemote).toBe(true);
    expect(chandigarh.location).toBe("Chandigarh, India");

    const mohali = normalizeIndiaLocation("Mohali, Phase 8");
    expect(mohali.isIndiaOrRemote).toBe(true);
    expect(mohali.location).toBe("Mohali, Punjab, India");

    const panchkula = normalizeIndiaLocation("Panchkula MDC");
    expect(panchkula.isIndiaOrRemote).toBe(true);
    expect(panchkula.location).toBe("Panchkula, Haryana, India");
  });

  it("correctly flags work modes: Remote, Hybrid, and Onsite", () => {
    const remoteJob = normalizeIndiaLocation("Work From Home - India");
    expect(remoteJob.workMode).toBe(WorkMode.REMOTE);
    expect(remoteJob.isIndiaOrRemote).toBe(true);

    const wfh = normalizeIndiaLocation("Remote (Anywhere in India)");
    expect(wfh.workMode).toBe(WorkMode.REMOTE);
    expect(wfh.isIndiaOrRemote).toBe(true);

    const hybridJob = normalizeIndiaLocation("Hybrid - Bengaluru, Karnataka");
    expect(hybridJob.workMode).toBe(WorkMode.HYBRID);
    expect(hybridJob.isIndiaOrRemote).toBe(true);
  });

  it("rejects purely foreign on-site positions", () => {
    const sfJob = normalizeIndiaLocation("San Francisco, CA, USA");
    expect(sfJob.isIndiaOrRemote).toBe(false);

    const londonJob = normalizeIndiaLocation("London, UK");
    expect(londonJob.isIndiaOrRemote).toBe(false);

    const torontoJob = normalizeIndiaLocation("Toronto, Ontario, Canada");
    expect(torontoJob.isIndiaOrRemote).toBe(false);
  });

  it("handles empty or undefined location gracefully", () => {
    const empty = normalizeIndiaLocation("");
    expect(empty.isIndiaOrRemote).toBe(false);
    expect(empty.workMode).toBe(WorkMode.ON_SITE);
  });
});
