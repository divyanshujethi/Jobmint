/**
 * RoleNest Chrome Extension - Popup Controller
 */

const API_BASE = "https://rolenest.in";

document.addEventListener("DOMContentLoaded", async () => {
  const formView = document.getElementById("form-view");
  const successView = document.getElementById("success-view");
  const form = document.getElementById("track-form");
  const detectionPill = document.getElementById("detection-pill");
  const detectionText = document.getElementById("detection-text");

  const titleInput = document.getElementById("job-title");
  const companyInput = document.getElementById("company-name");
  const locationInput = document.getElementById("location");
  const salaryInput = document.getElementById("salary");
  const statusInput = document.getElementById("status");
  const notesInput = document.getElementById("notes");
  const sourceUrlInput = document.getElementById("source-url");

  const btnSubmit = document.getElementById("btn-submit");
  const btnText = document.getElementById("btn-text");
  const btnSpinner = document.getElementById("btn-spinner");
  const btnTrackAnother = document.getElementById("btn-track-another");

  // 1. Get current active tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      sourceUrlInput.value = tab.url || "";

      // Try communicating with content script
      try {
        const data = await chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_JOB_DETAILS" });
        if (data && (data.title || data.companyName)) {
          if (data.title) titleInput.value = data.title;
          if (data.companyName) companyInput.value = data.companyName;
          if (data.location) locationInput.value = data.location;
          if (data.salary) salaryInput.value = data.salary;
          if (data.url) sourceUrlInput.value = data.url;

          detectionPill.className = "pill pill-detected";
          detectionText.textContent = `Detected: ${data.companyName ? data.companyName + " • " : ""}${data.title || "Job Posting"}`;
        } else {
          fallbackFromTab(tab);
        }
      } catch (scriptErr) {
        // Content script might not be injected on this page (e.g. extension opened immediately)
        fallbackFromTab(tab);
      }
    }
  } catch (err) {
    console.warn("Could not query active tab:", err);
  }

  function fallbackFromTab(tab) {
    if (!tab) return;
    sourceUrlInput.value = tab.url || "";
    let cleanTitle = tab.title || "";
    if (cleanTitle.includes(" - ")) {
      const parts = cleanTitle.split(" - ");
      titleInput.value = parts[0].trim();
      companyInput.value = parts[1].trim();
    } else {
      titleInput.value = cleanTitle;
    }
    locationInput.value = "Remote";
    detectionPill.className = "pill pill-detecting";
    detectionText.textContent = "Extracted from page title";
  }

  // 2. Submit form to RoleNest
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      title: titleInput.value.trim(),
      companyName: companyInput.value.trim(),
      location: locationInput.value.trim() || "Remote",
      salary: salaryInput.value.trim() || null,
      status: statusInput.value,
      notes: notesInput.value.trim() || null,
      sourceUrl: sourceUrlInput.value || null,
    };

    if (!payload.title || !payload.companyName) {
      alert("Please specify at least a Job Title and Company.");
      return;
    }

    btnSubmit.disabled = true;
    btnText.textContent = "Saving to Journal...";
    btnSpinner.classList.remove("hidden");

    try {
      // Send to RoleNest web backend
      const res = await fetch(`${API_BASE}/api/extension/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // sends cookies if user is signed in to rolenest.in
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.requiresAuth || res.status === 401) {
          // Save locally so work is not lost, and offer sign in
          await saveLocally(payload);
          if (confirm("Please sign in to RoleNest to sync your applications to the cloud journal. Open RoleNest login now?")) {
            chrome.tabs.create({ url: `${API_BASE}/login?callbackUrl=/applications` });
          }
          return;
        }
        throw new Error(data.error || "Failed to save application.");
      }

      // Also persist to extension storage for fast offline reference
      await saveLocally({ ...payload, id: data.applicationId });

      // Show success view
      formView.classList.add("hidden");
      successView.classList.remove("hidden");
    } catch (err) {
      console.error("Save error:", err);
      // Fallback: save to local extension storage
      await saveLocally(payload);
      alert("Application saved locally in your extension. Note: " + (err.message || "Failed to sync to cloud."));
      formView.classList.add("hidden");
      successView.classList.remove("hidden");
    } finally {
      btnSubmit.disabled = false;
      btnText.textContent = "Track with RoleNest";
      btnSpinner.classList.add("hidden");
    }
  });

  async function saveLocally(app) {
    const { trackedApps = [] } = await chrome.storage.local.get("trackedApps");
    trackedApps.unshift({
      ...app,
      savedAt: new Date().toISOString(),
    });
    await chrome.storage.local.set({ trackedApps: trackedApps.slice(0, 50) });
  }

  // 3. Reset form
  btnTrackAnother.addEventListener("click", () => {
    form.reset();
    formView.classList.remove("hidden");
    successView.classList.add("hidden");
  });
});
