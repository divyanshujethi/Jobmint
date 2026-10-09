/**
 * RoleNest Chrome Extension - Content Script
 * Automatically extracts job title, company name, location, and apply link from active tab.
 */

function extractSchemaOrgJob() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || "{}");
      const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      for (const item of items) {
        if (item["@type"] === "JobPosting") {
          return {
            title: item.title || item.name || "",
            companyName:
              typeof item.hiringOrganization === "object"
                ? item.hiringOrganization?.name || ""
                : String(item.hiringOrganization || ""),
            location:
              typeof item.jobLocation === "object"
                ? item.jobLocation?.address?.addressLocality ||
                  item.jobLocation?.address?.addressRegion ||
                  "Remote"
                : "Remote",
            salary: item.baseSalary?.value
              ? String(item.baseSalary.value)
              : item.estimatedSalary?.value
              ? String(item.estimatedSalary.value)
              : "",
          };
        }
      }
    } catch {}
  }
  return null;
}

function extractKnownPortals() {
  const host = window.location.hostname.toLowerCase();

  // 1. LinkedIn
  if (host.includes("linkedin.com")) {
    const titleEl =
      document.querySelector(".job-details-jobs-unified-top-card__job-title") ||
      document.querySelector("h1.t-24") ||
      document.querySelector(".topcard__title");
    const companyEl =
      document.querySelector(".job-details-jobs-unified-top-card__company-name") ||
      document.querySelector(".topcard__flavor--black-link") ||
      document.querySelector(".job-details-jobs-unified-top-card__primary-description a");
    const locEl =
      document.querySelector(".job-details-jobs-unified-top-card__bullet") ||
      document.querySelector(".topcard__flavor--bullet");

    if (titleEl || companyEl) {
      return {
        title: titleEl?.textContent?.trim() || "",
        companyName: companyEl?.textContent?.trim() || "",
        location: locEl?.textContent?.trim() || "Remote",
      };
    }
  }

  // 2. Greenhouse
  if (host.includes("greenhouse.io")) {
    const titleEl = document.querySelector(".app-title") || document.querySelector("h1");
    const companyEl = document.querySelector(".company-name") || document.querySelector(".header__title");
    const locEl = document.querySelector(".location") || document.querySelector(".body__location");

    if (titleEl) {
      return {
        title: titleEl?.textContent?.trim() || "",
        companyName: companyEl?.textContent?.trim() || "",
        location: locEl?.textContent?.trim() || "Remote",
      };
    }
  }

  // 3. Lever
  if (host.includes("lever.co")) {
    const titleEl = document.querySelector(".posting-headline h2") || document.querySelector("h2");
    const compEl = document.querySelector(".main-header-text") || document.querySelector(".posting-header h1");
    const locEl = document.querySelector(".posting-categories .location") || document.querySelector(".sort-by-location");

    if (titleEl) {
      return {
        title: titleEl?.textContent?.trim() || "",
        companyName: compEl?.textContent?.trim() || "",
        location: locEl?.textContent?.trim() || "Remote",
      };
    }
  }

  // 4. Indeed
  if (host.includes("indeed.com")) {
    const titleEl = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]') || document.querySelector("h1.jobsearch-JobInfoHeader-title");
    const compEl = document.querySelector('[data-testid="inlineHeader-companyName"]') || document.querySelector(".jobsearch-InlineCompanyRating-companyHeader");
    const locEl = document.querySelector('[data-testid="inlineHeader-companyLocation"]') || document.querySelector(".jobsearch-JobInfoHeader-subtitle");

    if (titleEl) {
      return {
        title: titleEl?.textContent?.trim() || "",
        companyName: compEl?.textContent?.trim() || "",
        location: locEl?.textContent?.trim() || "Remote",
      };
    }
  }

  // 5. Workday
  if (host.includes("myworkdayjobs.com")) {
    const titleEl = document.querySelector('[data-automation-id="jobPostingHeader"]');
    const locEl = document.querySelector('[data-automation-id="jobPostingLocation"]');
    if (titleEl) {
      return {
        title: titleEl?.textContent?.trim() || "",
        companyName: host.split(".")[0]?.replace(/[^a-zA-Z0-9]/g, " ") || "",
        location: locEl?.textContent?.trim() || "Remote",
      };
    }
  }

  return null;
}

function extractGeneric() {
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
  const ogSiteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute("content");
  const docTitle = document.title || "";

  let title = ogTitle || docTitle;
  let companyName = ogSiteName || "";

  // Split title if formatted like "Role at Company" or "Role - Company"
  if (title.includes(" at ")) {
    const parts = title.split(" at ");
    title = parts[0].trim();
    if (!companyName) companyName = parts[1].split("|")[0].split("-")[0].trim();
  } else if (title.includes(" - ")) {
    const parts = title.split(" - ");
    title = parts[0].trim();
    if (!companyName) companyName = parts[1].split("|")[0].trim();
  } else if (title.includes(" | ")) {
    const parts = title.split(" | ");
    title = parts[0].trim();
    if (!companyName) companyName = parts[1].trim();
  }

  return {
    title: title.slice(0, 100),
    companyName: companyName.slice(0, 80),
    location: "Remote",
  };
}

function getJobDetails() {
  const schemaData = extractSchemaOrgJob();
  const portalData = extractKnownPortals();
  const genericData = extractGeneric();

  const title = (schemaData?.title || portalData?.title || genericData?.title || "").trim();
  const companyName = (schemaData?.companyName || portalData?.companyName || genericData?.companyName || "").trim();
  const location = (schemaData?.location || portalData?.location || genericData?.location || "Remote").trim();
  const salary = (schemaData?.salary || "").trim();
  const url = window.location.href;

  return {
    title,
    companyName,
    location,
    salary,
    url,
  };
}

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_JOB_DETAILS") {
    sendResponse(getJobDetails());
  }
  return true;
});
