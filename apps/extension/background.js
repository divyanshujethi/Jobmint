/**
 * RoleNest Chrome Extension - Background Service Worker
 * Manifest V3 Ephemeral Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("[RoleNest Extension] Installed successfully.");

  // Create context menu for quick right-click tracking
  try {
    chrome.contextMenus.create({
      id: "rolenest-track-page",
      title: "Track this Job with RoleNest",
      contexts: ["page", "selection"],
    });
  } catch {}
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "rolenest-track-page" && tab?.id) {
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_JOB_DETAILS" });
      if (response && response.title) {
        // Store in local storage for popup or auto-save
        await chrome.storage.local.set({ lastExtractedJob: response });
      }
    } catch (err) {
      console.warn("Could not extract via context menu:", err);
    }
  }
});
