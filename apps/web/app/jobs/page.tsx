"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  Sparkles,
  X,
  ShieldCheck,
  Building2,
  Zap,
  Layers,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  FileText,
  Phone,
  AlertCircle,
} from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { InstantAlertsBanner } from "@/components/instant-alerts-modal";
import { JobType, WorkMode } from "@repo/shared";
import {
  CandidateIntelProfile,
  DEFAULT_INTEL_PROFILE,
  loadCandidateIntel,
  interleaveJobsByCompany,
  groupJobsByCompany,
  scoreJobForCandidate,
} from "@/lib/candidate-intelligence";
import { CandidateIntelBar } from "@/components/candidate-intel-bar";
import { CompanyJobGroupCard } from "@/components/company-job-group-card";
import { SpotlightSearch, useSpotlight } from "@/components/spotlight-search";
import { RoloMascot } from "@/components/rolo-mascot";
import { ScrollToTop } from "@/components/scroll-to-top";

type ViewMode = "DIVERSIFIED" | "COMPANY_GROUPED" | "RECOMMENDED";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedMode, setSelectedMode] = useState<string>("ALL");
  const [selectedExp, setSelectedExp] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyDirectAts, setOnlyDirectAts] = useState(false);
  const [freshnessFilter, setFreshnessFilter] = useState<string>("ALL");
  const [jobs, setJobs] = useState<MockJob[]>([]);
  const [totalServerJobs, setTotalServerJobs] = useState<number>(115091);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 15;

  // Spotlight search (Cmd/Ctrl+K)
  const spotlight = useSpotlight();

  // Instant feed search input ref
  const searchInputRef = useRef<HTMLInputElement>(null);

  // "/" keyboard shortcut to focus instant feed search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Candidate Intelligence System state
  const [intelProfile, setIntelProfile] = useState<CandidateIntelProfile>(DEFAULT_INTEL_PROFILE);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("DIVERSIFIED");

  useEffect(() => {
    // Load candidate intelligence profile from local storage or verified dev score
    setIntelProfile(loadCandidateIntel());

    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.profile) {
          setCandidateProfile(data.profile);
        }
      })
      .catch(() => {});

    // Initialize filter state from URL search params if present
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const query = sp.get("q") || sp.get("keyword") || sp.get("search");
      if (query) setSearchTerm(query);

      const loc = sp.get("location");
      if (loc) setSelectedLocation(loc);

      const typeParam = sp.get("type");
      if (typeParam) {
        if (typeParam.toUpperCase() === "INTERNSHIP") setSelectedType("INTERNSHIP");
        else if (typeParam.toUpperCase() === "FULL_TIME" || typeParam.toUpperCase() === "FULLTIME") setSelectedType("FULL_TIME");
      }

      const filterParam = sp.get("filter");
      if (filterParam === "remote") setSelectedMode("REMOTE");
      else if (filterParam === "fresher") setSelectedExp("0");
      else if (filterParam === "ai") setSearchTerm("AI");
      else if (filterParam === "fullstack") setSearchTerm("React");
    }

    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
        if (typeof data.totalCatalog === "number" && data.totalCatalog > 0) {
          setTotalServerJobs(data.totalCatalog);
        } else if (typeof data.total === "number" && data.total > 0) {
          setTotalServerJobs(data.total);
        }
      })
      .catch((err) => console.error("Error loading live jobs:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filtered jobs based on user's query and filter chips
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.companyName.toLowerCase().includes(query);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(query));
        const matchesLocation = job.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesLocation) {
          return false;
        }
      }

      // Job Type
      if (selectedType !== "ALL" && job.jobType !== selectedType) {
        return false;
      }

      // Work Mode
      if (selectedMode !== "ALL") {
        const targetMode = selectedMode.toUpperCase().replace(/[-_]/g, "");
        const jMode = (job.workMode || "").toUpperCase().replace(/[-_]/g, "");
        if (targetMode === "ONSITE") {
          if (!jMode.includes("ONSITE") && !jMode.includes("OFFICE")) return false;
        } else if (targetMode === "REMOTE") {
          if (!jMode.includes("REMOTE")) return false;
        } else if (targetMode === "HYBRID") {
          if (!jMode.includes("HYBRID")) return false;
        } else if (job.workMode !== selectedMode) {
          return false;
        }
      }

      // Experience Level
      if (selectedExp !== "ALL") {
        const exp = job.experienceYears ?? 0;
        if (selectedExp === "0" || selectedExp === "FRESHER") {
          if (exp > 0 && job.jobType !== JobType.INTERNSHIP) return false;
        } else if (selectedExp === "1-2") {
          if (exp < 1 || exp > 2) return false;
        } else if (selectedExp === "3-5") {
          if (exp < 3 || exp > 5) return false;
        } else if (selectedExp === "5+") {
          if (exp < 5) return false;
        }
      }

      // Location Filter
      if (selectedLocation !== "ALL") {
        const jLoc = (job.location || "").toLowerCase();
        const loc = selectedLocation.toLowerCase();

        // Specific isolated city boundaries
        if (loc === "chandigarh") {
          if (!jLoc.includes("chandigarh")) return false;
        } else if (loc === "mohali") {
          if (!jLoc.includes("mohali")) return false;
        } else if (loc === "panchkula") {
          if (!jLoc.includes("panchkula")) return false;
        } else if (loc === "greater_noida" || loc === "greater noida") {
          if (!jLoc.includes("greater noida")) return false;
        } else if (loc === "noida") {
          if (!jLoc.includes("noida") || jLoc.includes("greater noida")) return false;
        } else if (loc === "navi_mumbai" || loc === "navi mumbai") {
          if (!jLoc.includes("navi mumbai")) return false;
        } else if (loc === "thane") {
          if (!jLoc.includes("thane")) return false;
        } else if (loc === "mumbai") {
          if (!jLoc.includes("mumbai") || jLoc.includes("navi mumbai")) return false;
        } else if (loc === "delhi_ncr") {
          if (!jLoc.includes("delhi") && !jLoc.includes("noida") && !jLoc.includes("gurgaon") && !jLoc.includes("gurugram") && !jLoc.includes("ncr")) return false;
        } else if (loc === "gurugram") {
          if (!jLoc.includes("gurugram") && !jLoc.includes("gurgaon")) return false;
        } else if (loc === "sonipat") {
          if (!jLoc.includes("sonipat") && !jLoc.includes("sonepat")) return false;
        } else if (loc === "ludhiana") {
          if (!jLoc.includes("ludhiana")) return false;
        } else if (loc === "jalandhar") {
          if (!jLoc.includes("jalandhar")) return false;
        } else if (loc === "punjab") {
          if (!jLoc.includes("punjab") && !jLoc.includes("mohali") && !jLoc.includes("ludhiana") && !jLoc.includes("jalandhar") && !jLoc.includes("amritsar")) return false;
        } else if (loc === "haryana") {
          if (!jLoc.includes("haryana") && !jLoc.includes("gurugram") && !jLoc.includes("gurgaon") && !jLoc.includes("sonipat") && !jLoc.includes("panchkula")) return false;
        } else if (loc === "dehradun") {
          if (!jLoc.includes("dehradun")) return false;
        } else if (loc === "uttarakhand") {
          if (!jLoc.includes("uttarakhand") && !jLoc.includes("dehradun") && !jLoc.includes("haridwar") && !jLoc.includes("roorkee")) return false;
        } else if (loc === "solan") {
          if (!jLoc.includes("solan") && !jLoc.includes("baddi")) return false;
        } else if (loc === "kangra") {
          if (!jLoc.includes("kangra") && !jLoc.includes("dharamshala") && !jLoc.includes("dharamsala")) return false;
        } else if (loc === "shimla") {
          if (!jLoc.includes("shimla")) return false;
        } else if (loc === "himachal") {
          if (!jLoc.includes("himachal") && !jLoc.includes("solan") && !jLoc.includes("kangra") && !jLoc.includes("shimla") && !jLoc.includes("dharamshala")) return false;
        } else if (loc === "ahmedabad") {
          if (!jLoc.includes("ahmedabad") || jLoc.includes("gandhinagar")) return false;
        } else if (loc === "gandhinagar") {
          if (!jLoc.includes("gandhinagar")) return false;
        } else if (loc === "surat") {
          if (!jLoc.includes("surat")) return false;
        } else if (loc === "vadodara") {
          if (!jLoc.includes("vadodara") && !jLoc.includes("baroda")) return false;
        } else if (loc === "rajkot") {
          if (!jLoc.includes("rajkot")) return false;
        } else if (loc === "gujarat") {
          if (!jLoc.includes("gujarat") && !jLoc.includes("ahmedabad") && !jLoc.includes("gandhinagar") && !jLoc.includes("surat") && !jLoc.includes("vadodara") && !jLoc.includes("rajkot")) return false;
        } else if (loc === "jaipur") {
          if (!jLoc.includes("jaipur")) return false;
        } else if (loc === "jodhpur") {
          if (!jLoc.includes("jodhpur")) return false;
        } else if (loc === "kota") {
          if (!jLoc.includes("kota")) return false;
        } else if (loc === "udaipur") {
          if (!jLoc.includes("udaipur")) return false;
        } else if (loc === "rajasthan") {
          if (!jLoc.includes("rajasthan") && !jLoc.includes("jaipur") && !jLoc.includes("jodhpur") && !jLoc.includes("kota") && !jLoc.includes("udaipur")) return false;
        } else if (loc === "lucknow") {
          if (!jLoc.includes("lucknow")) return false;
        } else if (loc === "kanpur") {
          if (!jLoc.includes("kanpur")) return false;
        } else if (loc === "varanasi") {
          if (!jLoc.includes("varanasi") && !jLoc.includes("banaras") && !jLoc.includes("kashi")) return false;
        } else if (loc === "prayagraj") {
          if (!jLoc.includes("prayagraj") && !jLoc.includes("allahabad")) return false;
        } else if (loc === "meerut") {
          if (!jLoc.includes("meerut")) return false;
        } else if (loc === "uttar_pradesh" || loc === "up") {
          if (!jLoc.includes("uttar pradesh") && !jLoc.includes("noida") && !jLoc.includes("lucknow") && !jLoc.includes("kanpur") && !jLoc.includes("varanasi") && !jLoc.includes("prayagraj") && !jLoc.includes("meerut")) return false;
        } else if (loc === "patna") {
          if (!jLoc.includes("patna") || jLoc.includes("visakhapatnam")) return false;
        } else if (loc === "darbhanga") {
          if (!jLoc.includes("darbhanga")) return false;
        } else if (loc === "bihar") {
          if (!jLoc.includes("bihar") && (!jLoc.includes("patna") || jLoc.includes("visakhapatnam")) && !jLoc.includes("darbhanga")) return false;
        } else if (loc === "pune") {
          if (!jLoc.includes("pune")) return false;
        } else if (loc === "nagpur") {
          if (!jLoc.includes("nagpur")) return false;
        } else if (loc === "nashik") {
          if (!jLoc.includes("nashik") && !jLoc.includes("nasik")) return false;
        } else if (loc === "aurangabad") {
          if (!jLoc.includes("aurangabad") && !jLoc.includes("chhatrapati sambhajinagar")) return false;
        } else if (loc === "maharashtra") {
          if (!jLoc.includes("maharashtra") && !jLoc.includes("mumbai") && !jLoc.includes("pune") && !jLoc.includes("thane") && !jLoc.includes("nagpur") && !jLoc.includes("nashik") && !jLoc.includes("aurangabad")) return false;
        } else if (loc === "indore") {
          if (!jLoc.includes("indore")) return false;
        } else if (loc === "bhopal") {
          if (!jLoc.includes("bhopal")) return false;
        } else if (loc === "gwalior") {
          if (!jLoc.includes("gwalior")) return false;
        } else if (loc === "jabalpur") {
          if (!jLoc.includes("jabalpur")) return false;
        } else if (loc === "ujjain") {
          if (!jLoc.includes("ujjain")) return false;
        } else if (loc === "rewa") {
          if (!jLoc.includes("rewa")) return false;
        } else if (loc === "madhya_pradesh" || loc === "mp") {
          if (!jLoc.includes("madhya pradesh") && !jLoc.includes("indore") && !jLoc.includes("bhopal") && !jLoc.includes("gwalior") && !jLoc.includes("jabalpur") && !jLoc.includes("ujjain") && !jLoc.includes("rewa")) return false;
        } else if (loc === "guwahati") {
          if (!jLoc.includes("guwahati")) return false;
        } else if (loc === "shillong") {
          if (!jLoc.includes("shillong")) return false;
        } else if (loc === "kohima") {
          if (!jLoc.includes("kohima")) return false;
        } else if (loc === "imphal") {
          if (!jLoc.includes("imphal")) return false;
        } else if (loc === "agartala") {
          if (!jLoc.includes("agartala")) return false;
        } else if (loc === "aizawl") {
          if (!jLoc.includes("aizawl")) return false;
        } else if (loc === "itanagar") {
          if (!jLoc.includes("itanagar")) return false;
        } else if (loc === "gangtok") {
          if (!jLoc.includes("gangtok")) return false;
        } else if (loc === "kolkata") {
          if (!jLoc.includes("kolkata")) return false;
        } else if (loc === "siliguri") {
          if (!jLoc.includes("siliguri")) return false;
        } else if (loc === "durgapur") {
          if (!jLoc.includes("durgapur")) return false;
        } else if (loc === "kharagpur") {
          if (!jLoc.includes("kharagpur")) return false;
        } else if (loc === "west_bengal") {
          if (!jLoc.includes("west bengal") && !jLoc.includes("kolkata") && !jLoc.includes("siliguri") && !jLoc.includes("durgapur") && !jLoc.includes("kharagpur")) return false;
        } else if (loc === "northeast" || loc === "seven_sisters") {
          if (!jLoc.includes("assam") && !jLoc.includes("guwahati") && !jLoc.includes("shillong") && !jLoc.includes("meghalaya") && !jLoc.includes("kohima") && !jLoc.includes("nagaland") && !jLoc.includes("imphal") && !jLoc.includes("manipur") && !jLoc.includes("agartala") && !jLoc.includes("tripura") && !jLoc.includes("aizawl") && !jLoc.includes("mizoram") && !jLoc.includes("itanagar") && !jLoc.includes("arunachal") && !jLoc.includes("gangtok") && !jLoc.includes("sikkim")) return false;
        } else if (loc === "ranchi") {
          if (!jLoc.includes("ranchi")) return false;
        } else if (loc === "jamshedpur") {
          if (!jLoc.includes("jamshedpur")) return false;
        } else if (loc === "deoghar") {
          if (!jLoc.includes("deoghar")) return false;
        } else if (loc === "bokaro") {
          if (!jLoc.includes("bokaro")) return false;
        } else if (loc === "dhanbad") {
          if (!jLoc.includes("dhanbad")) return false;
        } else if (loc === "jharkhand") {
          if (!jLoc.includes("jharkhand") && !jLoc.includes("ranchi") && !jLoc.includes("jamshedpur") && !jLoc.includes("deoghar") && !jLoc.includes("bokaro") && !jLoc.includes("dhanbad")) return false;
        } else if (loc === "nava_raipur" || loc === "nava raipur") {
          if (!jLoc.includes("nava raipur")) return false;
        } else if (loc === "bhilai") {
          if (!jLoc.includes("bhilai")) return false;
        } else if (loc === "raipur") {
          if (!jLoc.includes("raipur") || jLoc.includes("nava raipur")) return false;
        } else if (loc === "chhattisgarh") {
          if (!jLoc.includes("chhattisgarh") && !jLoc.includes("raipur") && !jLoc.includes("bhilai")) return false;
        } else if (loc === "bhubaneswar") {
          if (!jLoc.includes("bhubaneswar")) return false;
        } else if (loc === "cuttack") {
          if (!jLoc.includes("cuttack")) return false;
        } else if (loc === "rourkela") {
          if (!jLoc.includes("rourkela")) return false;
        } else if (loc === "sambalpur") {
          if (!jLoc.includes("sambalpur")) return false;
        } else if (loc === "berhampur") {
          if (!jLoc.includes("berhampur")) return false;
        } else if (loc === "balasore") {
          if (!jLoc.includes("balasore")) return false;
        } else if (loc === "puri") {
          if (!jLoc.includes("puri")) return false;
        } else if (loc === "odisha") {
          if (!jLoc.includes("odisha") && !jLoc.includes("orissa") && !jLoc.includes("bhubaneswar") && !jLoc.includes("cuttack") && !jLoc.includes("rourkela") && !jLoc.includes("puri")) return false;
        } else if (loc === "bengaluru") {
          if (!jLoc.includes("bengaluru") && !jLoc.includes("bangalore")) return false;
        } else if (loc === "mysuru") {
          if (!jLoc.includes("mysuru") && !jLoc.includes("mysore")) return false;
        } else if (loc === "mangaluru") {
          if (!jLoc.includes("mangaluru") && !jLoc.includes("mangalore")) return false;
        } else if (loc === "hubballi") {
          if (!jLoc.includes("hubballi") && !jLoc.includes("hubli") && !jLoc.includes("dharwad")) return false;
        } else if (loc === "belagavi") {
          if (!jLoc.includes("belagavi") && !jLoc.includes("belgaum")) return false;
        } else if (loc === "shivamogga") {
          if (!jLoc.includes("shivamogga") && !jLoc.includes("shimoga")) return false;
        } else if (loc === "tumakuru") {
          if (!jLoc.includes("tumakuru") && !jLoc.includes("tumkur")) return false;
        } else if (loc === "davangere") {
          if (!jLoc.includes("davangere") && !jLoc.includes("davanagere")) return false;
        } else if (loc === "kalaburagi") {
          if (!jLoc.includes("kalaburagi") && !jLoc.includes("gulbarga")) return false;
        } else if (loc === "karnataka") {
          if (!jLoc.includes("karnataka") && !jLoc.includes("bengaluru") && !jLoc.includes("bangalore") && !jLoc.includes("mysuru") && !jLoc.includes("mangaluru") && !jLoc.includes("hubballi") && !jLoc.includes("belagavi")) return false;
        } else if (loc === "panaji") {
          if (!jLoc.includes("panaji") && !jLoc.includes("panjim")) return false;
        } else if (loc === "verna") {
          if (!jLoc.includes("verna")) return false;
        } else if (loc === "porvorim") {
          if (!jLoc.includes("porvorim")) return false;
        } else if (loc === "margao") {
          if (!jLoc.includes("margao") && !jLoc.includes("madgaon")) return false;
        } else if (loc === "mandrem") {
          if (!jLoc.includes("mandrem")) return false;
        } else if (loc === "goa") {
          if (!jLoc.includes("goa") && !jLoc.includes("panaji") && !jLoc.includes("verna") && !jLoc.includes("porvorim") && !jLoc.includes("margao") && !jLoc.includes("mandrem")) return false;
        } else if (loc === "hyderabad") {
          if (!jLoc.includes("hyderabad") && !jLoc.includes("secunderabad")) return false;
        } else if (loc === "warangal") {
          if (!jLoc.includes("warangal")) return false;
        } else if (loc === "karimnagar") {
          if (!jLoc.includes("karimnagar")) return false;
        } else if (loc === "khammam") {
          if (!jLoc.includes("khammam")) return false;
        } else if (loc === "nizamabad") {
          if (!jLoc.includes("nizamabad")) return false;
        } else if (loc === "mahbubnagar") {
          if (!jLoc.includes("mahbubnagar") && !jLoc.includes("mahabubnagar")) return false;
        } else if (loc === "telangana") {
          if (!jLoc.includes("telangana") && !jLoc.includes("hyderabad") && !jLoc.includes("warangal") && !jLoc.includes("karimnagar")) return false;
        } else if (loc === "visakhapatnam") {
          if (!jLoc.includes("visakhapatnam") && !jLoc.includes("vizag")) return false;
        } else if (loc === "vijayawada") {
          if (!jLoc.includes("vijayawada")) return false;
        } else if (loc === "guntur") {
          if (!jLoc.includes("guntur")) return false;
        } else if (loc === "kakinada") {
          if (!jLoc.includes("kakinada")) return false;
        } else if (loc === "tirupati") {
          if (!jLoc.includes("tirupati")) return false;
        } else if (loc === "anantapur") {
          if ((!jLoc.includes("anantapur") && !jLoc.includes("ananthapur")) || jLoc.includes("thiruvananthapuram")) return false;
        } else if (loc === "andhra_pradesh" || loc === "andhra") {
          if (!jLoc.includes("andhra") && !jLoc.includes("visakhapatnam") && !jLoc.includes("vijayawada") && !jLoc.includes("guntur") && !jLoc.includes("tirupati")) return false;
        } else if (loc === "chennai") {
          if (!jLoc.includes("chennai") && !jLoc.includes("madras")) return false;
        } else if (loc === "coimbatore") {
          if (!jLoc.includes("coimbatore") && !jLoc.includes("kovai")) return false;
        } else if (loc === "hosur") {
          if (!jLoc.includes("hosur")) return false;
        } else if (loc === "madurai") {
          if (!jLoc.includes("madurai")) return false;
        } else if (loc === "tiruchirappalli") {
          if (!jLoc.includes("tiruchirappalli") && !jLoc.includes("trichy")) return false;
        } else if (loc === "salem") {
          if (!jLoc.includes("salem")) return false;
        } else if (loc === "tirunelveli") {
          if (!jLoc.includes("tirunelveli")) return false;
        } else if (loc === "tamil_nadu") {
          if (!jLoc.includes("tamil nadu") && !jLoc.includes("chennai") && !jLoc.includes("coimbatore") && !jLoc.includes("hosur") && !jLoc.includes("madurai")) return false;
        } else if (loc === "thiruvananthapuram") {
          if (!jLoc.includes("thiruvananthapuram") && !jLoc.includes("trivandrum")) return false;
        } else if (loc === "kochi") {
          if (!jLoc.includes("kochi") && !jLoc.includes("cochin")) return false;
        } else if (loc === "kozhikode") {
          if (!jLoc.includes("kozhikode") && !jLoc.includes("calicut")) return false;
        } else if (loc === "thrissur") {
          if (!jLoc.includes("thrissur") && !jLoc.includes("trichur")) return false;
        } else if (loc === "palakkad") {
          if (!jLoc.includes("palakkad") && !jLoc.includes("palghat")) return false;
        } else if (loc === "kannur") {
          if (!jLoc.includes("kannur") && !jLoc.includes("cannanore")) return false;
        } else if (loc === "kerala") {
          if (!jLoc.includes("kerala") && !jLoc.includes("kochi") && !jLoc.includes("thiruvananthapuram") && !jLoc.includes("kozhikode")) return false;
        } else if (loc === "remote") {
          const jMode = (job.workMode || "").toUpperCase();
          if (!jMode.includes("REMOTE") && !jLoc.includes("remote")) return false;
        } else if (loc === "india") {
          if (!jLoc.includes("india")) return false;
        } else if (!jLoc.includes(loc)) {
          return false;
        }
      }

      // Only Verified Companies
      if (onlyVerified && !job.isVerified) {
        return false;
      }

      // Only Direct Official ATS Apply Links
      if (onlyDirectAts && !job.sourceUrl) {
        return false;
      }

      // Freshness Filter
      if (freshnessFilter !== "ALL") {
        const postedMs = new Date(job.postedAt || 0).getTime();
        const ageHours = (Date.now() - postedMs) / (1000 * 60 * 60);
        if (freshnessFilter === "24H" && ageHours > 24) return false;
        if (freshnessFilter === "3D" && ageHours > 72) return false;
        if (freshnessFilter === "7D" && ageHours > 168) return false;
      }

      return true;
    });
  }, [jobs, searchTerm, selectedType, selectedMode, selectedExp, selectedLocation, onlyVerified, onlyDirectAts, freshnessFilter]);

  // Diversified Feed: Interleaved round-robin by company so no 20 GitLab / 10 MongoDB in a row
  const diversifiedJobs = useMemo(() => {
    return interleaveJobsByCompany(filteredJobs);
  }, [filteredJobs]);

  // Recommended Jobs: Filtered for score >= 60%, sorted highest score first
  const recommendedJobsWithScores = useMemo(() => {
    return filteredJobs
      .map((job) => ({
        job,
        scoreInfo: scoreJobForCandidate(job, intelProfile),
      }))
      .filter(({ scoreInfo }) => scoreInfo.totalScore >= 55)
      .sort((a, b) => b.scoreInfo.totalScore - a.scoreInfo.totalScore);
  }, [filteredJobs, intelProfile]);

  // Grouped by Company
  const companyGroups = useMemo(() => {
    return groupJobsByCompany(filteredJobs, intelProfile);
  }, [filteredJobs, intelProfile]);

  // Top AI Recommendations (Top 3 for carousel/banner)
  const topAIRecommendations = useMemo(() => {
    return recommendedJobsWithScores.slice(0, 3);
  }, [recommendedJobsWithScores]);

  // Reset pagination to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedMode, selectedExp, selectedLocation, onlyVerified, onlyDirectAts, freshnessFilter, viewMode]);

  // Paginated Diversified Jobs
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return diversifiedJobs.slice(start, start + PAGE_SIZE);
  }, [diversifiedJobs, currentPage]);

  const totalPages = Math.max(1, Math.ceil(diversifiedJobs.length / PAGE_SIZE));

  // Paginated Recommended Jobs
  const paginatedRecommended = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return recommendedJobsWithScores.slice(start, start + PAGE_SIZE);
  }, [recommendedJobsWithScores, currentPage]);

  const totalRecommendedPages = Math.max(1, Math.ceil(recommendedJobsWithScores.length / PAGE_SIZE));

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedType !== "ALL" ||
    selectedMode !== "ALL" ||
    selectedExp !== "ALL" ||
    selectedLocation !== "ALL" ||
    onlyVerified ||
    onlyDirectAts ||
    freshnessFilter !== "ALL";

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedType("ALL");
    setSelectedMode("ALL");
    setSelectedExp("ALL");
    setSelectedLocation("ALL");
    setOnlyVerified(false);
    setOnlyDirectAts(false);
    setFreshnessFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <>
      {/* Spotlight Search Modal — Cmd/Ctrl+K */}
      <SpotlightSearch
        jobs={jobs}
        isOpen={spotlight.isOpen}
        onClose={spotlight.close}
      />

      {/* Floating Scroll to Top Arrow Button */}
      <ScrollToTop className="bottom-36 right-5 md:bottom-28 md:right-9" />

      {/* Rolo interactive floating mascot */}
      <RoloMascot
        floating
        onQuickFilter={(f) => {
          if (f.exp !== undefined) setSelectedExp(f.exp);
          if (f.mode !== undefined) setSelectedMode(f.mode);
          if (f.search !== undefined) setSearchTerm(f.search);
          if (f.type !== undefined) setSelectedType(f.type);
          setCurrentPage(1);
        }}
      />

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            href="/transparency"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md mb-2 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Verification Methodology &amp; Anti-Ghosting Standards →
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Verified Indian engineering roles &amp; remote global teams with honest recruiter stats.
          </p>
        </div>

        {/* SPOTLIGHT SEARCH TRIGGER */}
        <button
          type="button"
          onClick={spotlight.open}
          className="group flex items-center gap-2 w-full md:w-80 rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-3 text-sm text-slate-400 shadow-2xs hover:border-emerald-400 hover:shadow-emerald-100/60 hover:shadow-md transition-all"
        >
          <Search className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
          <span className="flex-1 text-left text-sm text-slate-400">Search jobs, skills, companies…</span>
          <kbd className="shrink-0 hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* CANDIDATE INTELLIGENCE SYSTEM BAR */}
      <CandidateIntelBar
        profile={intelProfile}
        onChange={setIntelProfile}
        totalMatchedRoles={recommendedJobsWithScores.length}
      />

      {/* QUICK CANDIDATE 1-CLICK SEARCH CHIPS */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-emerald-600" /> Quick Filter:
        </span>
        {[
          { label: "🏛️ Govt & PSU Tech", href: "/gov-tech" },
          { label: "📍 Chandigarh", action: () => setSelectedLocation("chandigarh") },
          { label: "📍 Mohali", action: () => setSelectedLocation("mohali") },
          { label: "📍 Panchkula", action: () => setSelectedLocation("panchkula") },
          { label: "📍 Gurugram", action: () => setSelectedLocation("gurugram") },
          { label: "📍 Noida", action: () => setSelectedLocation("noida") },
          { label: "📍 Greater Noida", action: () => setSelectedLocation("greater_noida") },
          { label: "📍 Dehradun", action: () => setSelectedLocation("dehradun") },
          { label: "📍 Ahmedabad", action: () => setSelectedLocation("ahmedabad") },
          { label: "📍 Jaipur", action: () => setSelectedLocation("jaipur") },
          { label: "📍 Lucknow", action: () => setSelectedLocation("lucknow") },
          { label: "📍 Patna", action: () => setSelectedLocation("patna") },
          { label: "📍 Mumbai", action: () => setSelectedLocation("mumbai") },
          { label: "📍 Pune", action: () => setSelectedLocation("pune") },
          { label: "📍 Kolkata", action: () => setSelectedLocation("kolkata") },
          { label: "📍 Bhubaneswar", action: () => setSelectedLocation("bhubaneswar") },
          { label: "📍 Ranchi", action: () => setSelectedLocation("ranchi") },
          { label: "📍 Raipur", action: () => setSelectedLocation("raipur") },
          { label: "📍 Guwahati", action: () => setSelectedLocation("guwahati") },
          { label: "📍 Bengaluru", action: () => setSelectedLocation("bengaluru") },
          { label: "📍 Mysuru", action: () => setSelectedLocation("mysuru") },
          { label: "📍 Goa (Panaji)", action: () => setSelectedLocation("panaji") },
          { label: "📍 Hyderabad", action: () => setSelectedLocation("hyderabad") },
          { label: "📍 Visakhapatnam", action: () => setSelectedLocation("visakhapatnam") },
          { label: "📍 Chennai", action: () => setSelectedLocation("chennai") },
          { label: "📍 Coimbatore", action: () => setSelectedLocation("coimbatore") },
          { label: "📍 Kochi", action: () => setSelectedLocation("kochi") },
          { label: "📍 Thiruvananthapuram", action: () => setSelectedLocation("thiruvananthapuram") },
          { label: "🌐 Remote India", action: () => { setSelectedMode(WorkMode.REMOTE); setSelectedLocation("india"); } },
          { label: "🎓 Freshers (0 YOE)", action: () => setSelectedExp("0") },
          { label: "🚀 Startups", action: () => setSearchTerm("Startup") },
          { label: "React / Next.js", action: () => setSearchTerm("React") },
          { label: "Python / AI", action: () => setSearchTerm("Python") },
          { label: "Internships", action: () => setSelectedType(JobType.INTERNSHIP) },
        ].map((chip) =>
          chip.href ? (
            <Link
              key={chip.label}
              href={chip.href}
              className="rounded-full bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-1 text-[11px] font-bold text-emerald-900 transition-colors"
            >
              {chip.label}
            </Link>
          ) : (
            <button
              key={chip.label}
              type="button"
              onClick={chip.action}
              className="rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              {chip.label}
            </button>
          )
        )}
      </div>

      {/* CANDIDATE PROFILE COMPLETION BANNER (Shown when user has not yet uploaded their resume) */}
      {candidateProfile && !candidateProfile.hasResume && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-50/60 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Profile {candidateProfile.completionPercent || 25}% Complete
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified Candidate Readiness
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Upload your resume to unlock Real AI ATS Match Scoring
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                We calculate honest, transparent match scores against real job descriptions. Since you haven&apos;t uploaded your resume yet, upload your CV or add your phone number so verified recruiters can reach you.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
              <Link href="/profile/resume">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Upload Resume →
                </Button>
              </Link>
              {!candidateProfile.hasPhone && (
                <Link href="/settings/account">
                  <Button variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 font-semibold text-xs h-9 px-3 rounded-xl">
                    <Phone className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                    Add Mobile
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Missing Checklist Pills */}
          {candidateProfile.missingFields && candidateProfile.missingFields.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60 text-xs">
              <span className="text-[11px] font-bold text-slate-500">Missing steps:</span>
              {candidateProfile.missingFields.map((field: string) => (
                <span key={field} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-emerald-200/80 text-[11px] text-slate-700 font-medium">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  {field}
                </span>
              ))}
            </div>
          )}

          {/* Completion Progress Bar */}
          <div className="w-full bg-emerald-200/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${candidateProfile.completionPercent || 25}%` }}
            />
          </div>
        </div>
      )}

      {/* TOP AI PICKS HIGHLIGHT BANNER (Only when relevant matches exist and candidate has real profile/resume) */}
      {(candidateProfile?.hasResume || !candidateProfile) && topAIRecommendations.length > 0 && viewMode !== "COMPANY_GROUPED" && (
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/70 via-orange-50/30 to-amber-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white shadow-2xs">
                <Flame className="h-4 w-4 fill-white text-white" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  Top AI Matches For You
                  <span className="rounded-full bg-amber-200 text-amber-950 px-2 py-0.2 text-[10px] font-black">
                    85%+ FIT
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600">
                  Calculated against your verified skills: {intelProfile.skills.slice(0, 4).join(", ")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("RECOMMENDED")}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Recommended ({recommendedJobsWithScores.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {topAIRecommendations.map(({ job, scoreInfo }) => (
              <div
                key={job.id}
                className="rounded-xl border border-amber-200 bg-white p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {job.companyName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black shrink-0">
                      {scoreInfo.badgeLabel}
                    </span>
                  </div>
                  <Link href={`/jobs/${job.slug}`}>
                    <h4 className="mt-1 text-xs sm:text-sm font-extrabold text-slate-900 hover:text-emerald-700 line-clamp-1">
                      {job.title}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {job.location} • {job.salaryOrStipend}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold truncate max-w-[150px]">
                    {scoreInfo.summary}
                  </span>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="text-[11px] font-extrabold text-emerald-700 hover:underline shrink-0"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE SWITCHER & COUNTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Toggle Pills: Recommended vs Diversified vs Grouped */}
        <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100/80 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode("DIVERSIFIED")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "DIVERSIFIED"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List className="h-3.5 w-3.5 text-slate-500" />
            <span>Feed View (Diversified)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("COMPANY_GROUPED")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "COMPANY_GROUPED"
                ? "bg-white text-emerald-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Group by Company ({companyGroups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("RECOMMENDED")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "RECOMMENDED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Recommended for You ({recommendedJobsWithScores.length})</span>
          </button>
        </div>

        {/* Results count & Reset */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">
            Showing{" "}
            <strong className="text-slate-900">
              {viewMode === "COMPANY_GROUPED"
                ? `${companyGroups.length} companies (${filteredJobs.length.toLocaleString()} roles of ${totalServerJobs.toLocaleString()} total)`
                : viewMode === "RECOMMENDED"
                ? `${recommendedJobsWithScores.length.toLocaleString()} matched roles (out of ${totalServerJobs.toLocaleString()})`
                : hasActiveFilters
                ? `${filteredJobs.length.toLocaleString()} filtered roles (out of ${totalServerJobs.toLocaleString()})`
                : `${filteredJobs.length.toLocaleString()} of ${totalServerJobs.toLocaleString()} live tech roles`}
            </strong>
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline ml-2 cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
        {/* Row 1: Job Types & Quick Selectors + Instant Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedType("ALL")}
              className={`min-h-[38px] inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation cursor-pointer ${
                selectedType === "ALL"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Opportunities ({jobs.length})
            </button>
            <button
              onClick={() => setSelectedType(JobType.INTERNSHIP)}
              className={`min-h-[38px] inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation cursor-pointer ${
                selectedType === JobType.INTERNSHIP
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Internships
            </button>
            <button
              onClick={() => setSelectedType(JobType.FULL_TIME)}
              className={`min-h-[38px] inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation cursor-pointer ${
                selectedType === JobType.FULL_TIME
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Full-Time Roles
            </button>
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search roles, tech, city... (press /)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Regional City Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <MapPin className="h-3 w-3 text-slate-400" /> Cities:
          </span>
          {[
            { id: "ALL", label: "All Cities" },
            { id: "chandigarh", label: "Chandigarh" },
            { id: "mohali", label: "Mohali" },
            { id: "panchkula", label: "Panchkula" },
            { id: "gurugram", label: "Gurugram" },
            { id: "sonipat", label: "Sonipat" },
            { id: "noida", label: "Noida" },
            { id: "greater_noida", label: "Greater Noida" },
            { id: "delhi_ncr", label: "New Delhi" },
            { id: "ludhiana", label: "Ludhiana" },
            { id: "jalandhar", label: "Jalandhar" },
            { id: "dehradun", label: "Dehradun" },
            { id: "solan", label: "Solan" },
            { id: "kangra", label: "Kangra" },
            { id: "shimla", label: "Shimla" },
            { id: "ahmedabad", label: "Ahmedabad" },
            { id: "gandhinagar", label: "Gandhinagar" },
            { id: "surat", label: "Surat" },
            { id: "vadodara", label: "Vadodara" },
            { id: "rajkot", label: "Rajkot" },
            { id: "jaipur", label: "Jaipur" },
            { id: "jodhpur", label: "Jodhpur" },
            { id: "kota", label: "Kota" },
            { id: "udaipur", label: "Udaipur" },
            { id: "lucknow", label: "Lucknow" },
            { id: "kanpur", label: "Kanpur" },
            { id: "varanasi", label: "Varanasi" },
            { id: "prayagraj", label: "Prayagraj" },
            { id: "meerut", label: "Meerut" },
            { id: "patna", label: "Patna" },
            { id: "darbhanga", label: "Darbhanga" },
            { id: "mumbai", label: "Mumbai" },
            { id: "navi_mumbai", label: "Navi Mumbai" },
            { id: "thane", label: "Thane" },
            { id: "pune", label: "Pune" },
            { id: "nagpur", label: "Nagpur" },
            { id: "nashik", label: "Nashik" },
            { id: "aurangabad", label: "Aurangabad" },
            { id: "indore", label: "Indore" },
            { id: "bhopal", label: "Bhopal" },
            { id: "gwalior", label: "Gwalior" },
            { id: "jabalpur", label: "Jabalpur" },
            { id: "ujjain", label: "Ujjain" },
            { id: "rewa", label: "Rewa" },
            { id: "kolkata", label: "Kolkata" },
            { id: "siliguri", label: "Siliguri" },
            { id: "durgapur", label: "Durgapur" },
            { id: "kharagpur", label: "Kharagpur" },
            { id: "guwahati", label: "Guwahati" },
            { id: "shillong", label: "Shillong" },
            { id: "gangtok", label: "Gangtok" },
            { id: "ranchi", label: "Ranchi" },
            { id: "jamshedpur", label: "Jamshedpur" },
            { id: "dhanbad", label: "Dhanbad" },
            { id: "raipur", label: "Raipur" },
            { id: "nava_raipur", label: "Nava Raipur" },
            { id: "bhilai", label: "Bhilai" },
            { id: "bhubaneswar", label: "Bhubaneswar" },
            { id: "cuttack", label: "Cuttack" },
            { id: "rourkela", label: "Rourkela" },
            { id: "puri", label: "Puri" },
            { id: "bengaluru", label: "Bengaluru" },
            { id: "mysuru", label: "Mysuru" },
            { id: "mangaluru", label: "Mangaluru" },
            { id: "hubballi", label: "Hubballi" },
            { id: "panaji", label: "Goa (Panaji)" },
            { id: "hyderabad", label: "Hyderabad" },
            { id: "warangal", label: "Warangal" },
            { id: "visakhapatnam", label: "Visakhapatnam" },
            { id: "vijayawada", label: "Vijayawada" },
            { id: "chennai", label: "Chennai" },
            { id: "coimbatore", label: "Coimbatore" },
            { id: "madurai", label: "Madurai" },
            { id: "kochi", label: "Kochi" },
            { id: "thiruvananthapuram", label: "Thiruvananthapuram" },
            { id: "kozhikode", label: "Kozhikode" },
            { id: "remote", label: "Remote" },
          ].map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedLocation(city.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                selectedLocation === city.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        {/* Row 2: Detailed Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1 border-t border-slate-100">
          {/* Experience Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Experience Level
            </label>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Any Experience</option>
              <option value="0">Fresher / 0 Years (Entry Level)</option>
              <option value="1-2">1–2 Years Experience</option>
              <option value="3-5">3–5 Years Experience</option>
              <option value="5+">5+ Years Experience</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Location / City
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Any Location (All India & Remote)</option>
              <optgroup label="Chandigarh (Union Territory)">
                <option value="chandigarh">Chandigarh</option>
              </optgroup>
              <optgroup label="Punjab">
                <option value="mohali">Mohali, Punjab</option>
                <option value="ludhiana">Ludhiana, Punjab</option>
                <option value="jalandhar">Jalandhar, Punjab</option>
                <option value="punjab">Punjab (All Hubs)</option>
              </optgroup>
              <optgroup label="Haryana & Delhi NCR">
                <option value="panchkula">Panchkula, Haryana</option>
                <option value="gurugram">Gurugram / Gurgaon, Haryana</option>
                <option value="sonipat">Sonipat, Haryana</option>
                <option value="haryana">Haryana (All Hubs)</option>
                <option value="delhi_ncr">Delhi NCR / New Delhi</option>
              </optgroup>
              <optgroup label="Uttar Pradesh & Bihar">
                <option value="noida">Noida, UP</option>
                <option value="greater_noida">Greater Noida, UP</option>
                <option value="lucknow">Lucknow, UP</option>
                <option value="kanpur">Kanpur, UP</option>
                <option value="varanasi">Varanasi, UP</option>
                <option value="prayagraj">Prayagraj / Allahabad, UP</option>
                <option value="meerut">Meerut, UP</option>
                <option value="uttar_pradesh">Uttar Pradesh (All Hubs)</option>
                <option value="patna">Patna, Bihar</option>
                <option value="darbhanga">Darbhanga, Bihar</option>
                <option value="bihar">Bihar (All Hubs)</option>
              </optgroup>
              <optgroup label="West Bengal & Northeast (7 Sisters & Sikkim)">
                <option value="kolkata">Kolkata, West Bengal</option>
                <option value="siliguri">Siliguri, West Bengal</option>
                <option value="durgapur">Durgapur, West Bengal</option>
                <option value="kharagpur">Kharagpur, West Bengal</option>
                <option value="west_bengal">West Bengal (All Hubs)</option>
                <option value="guwahati">Guwahati, Assam</option>
                <option value="shillong">Shillong, Meghalaya</option>
                <option value="gangtok">Gangtok, Sikkim</option>
                <option value="agartala">Agartala, Tripura</option>
                <option value="imphal">Imphal, Manipur</option>
                <option value="aizawl">Aizawl, Mizoram</option>
                <option value="kohima">Kohima, Nagaland</option>
                <option value="itanagar">Itanagar, Arunachal Pradesh</option>
                <option value="northeast">Northeast & 7 Sisters (All Hubs)</option>
              </optgroup>
              <optgroup label="Odisha, Jharkhand & Chhattisgarh">
                <option value="bhubaneswar">Bhubaneswar, Odisha</option>
                <option value="cuttack">Cuttack, Odisha</option>
                <option value="rourkela">Rourkela, Odisha</option>
                <option value="sambalpur">Sambalpur, Odisha</option>
                <option value="berhampur">Berhampur, Odisha</option>
                <option value="balasore">Balasore, Odisha</option>
                <option value="puri">Puri, Odisha</option>
                <option value="odisha">Odisha (All Hubs)</option>
                <option value="ranchi">Ranchi, Jharkhand</option>
                <option value="jamshedpur">Jamshedpur, Jharkhand</option>
                <option value="deoghar">Deoghar, Jharkhand</option>
                <option value="bokaro">Bokaro, Jharkhand</option>
                <option value="dhanbad">Dhanbad, Jharkhand</option>
                <option value="jharkhand">Jharkhand (All Hubs)</option>
                <option value="raipur">Raipur, Chhattisgarh</option>
                <option value="nava_raipur">Nava Raipur, Chhattisgarh</option>
                <option value="bhilai">Bhilai, Chhattisgarh</option>
                <option value="chhattisgarh">Chhattisgarh (All Hubs)</option>
              </optgroup>
              <optgroup label="Gujarat & Rajasthan">
                <option value="ahmedabad">Ahmedabad, Gujarat</option>
                <option value="gandhinagar">Gandhinagar, Gujarat</option>
                <option value="surat">Surat, Gujarat</option>
                <option value="vadodara">Vadodara / Baroda, Gujarat</option>
                <option value="rajkot">Rajkot, Gujarat</option>
                <option value="gujarat">Gujarat (All Hubs)</option>
                <option value="jaipur">Jaipur, Rajasthan</option>
                <option value="jodhpur">Jodhpur, Rajasthan</option>
                <option value="kota">Kota, Rajasthan</option>
                <option value="udaipur">Udaipur, Rajasthan</option>
                <option value="rajasthan">Rajasthan (All Hubs)</option>
              </optgroup>
              <optgroup label="Maharashtra & Madhya Pradesh">
                <option value="mumbai">Mumbai, Maharashtra</option>
                <option value="navi_mumbai">Navi Mumbai, Maharashtra</option>
                <option value="thane">Thane, Maharashtra</option>
                <option value="pune">Pune, Maharashtra</option>
                <option value="nagpur">Nagpur, Maharashtra</option>
                <option value="nashik">Nashik, Maharashtra</option>
                <option value="aurangabad">Aurangabad, Maharashtra</option>
                <option value="maharashtra">Maharashtra (All Hubs)</option>
                <option value="indore">Indore, Madhya Pradesh</option>
                <option value="bhopal">Bhopal, Madhya Pradesh</option>
                <option value="gwalior">Gwalior, Madhya Pradesh</option>
                <option value="jabalpur">Jabalpur, Madhya Pradesh</option>
                <option value="ujjain">Ujjain, Madhya Pradesh</option>
                <option value="rewa">Rewa, Madhya Pradesh</option>
                <option value="madhya_pradesh">Madhya Pradesh (All Hubs)</option>
              </optgroup>
              <optgroup label="Himachal Pradesh & Uttarakhand">
                <option value="dehradun">Dehradun, Uttarakhand</option>
                <option value="uttarakhand">Uttarakhand (All Hubs)</option>
                <option value="solan">Solan, Himachal Pradesh</option>
                <option value="kangra">Kangra / Dharamshala, HP</option>
                <option value="shimla">Shimla, Himachal Pradesh</option>
                <option value="himachal">Himachal Pradesh (All Hubs)</option>
              </optgroup>
              <optgroup label="Karnataka & Goa">
                <option value="bengaluru">Bengaluru, Karnataka</option>
                <option value="mysuru">Mysuru, Karnataka</option>
                <option value="mangaluru">Mangaluru, Karnataka</option>
                <option value="hubballi">Hubballi-Dharwad, Karnataka</option>
                <option value="belagavi">Belagavi, Karnataka</option>
                <option value="shivamogga">Shivamogga, Karnataka</option>
                <option value="tumakuru">Tumakuru, Karnataka</option>
                <option value="davangere">Davangere, Karnataka</option>
                <option value="kalaburagi">Kalaburagi, Karnataka</option>
                <option value="karnataka">Karnataka (All Hubs)</option>
                <option value="panaji">Panaji (Panjim), Goa</option>
                <option value="verna">Verna, Goa</option>
                <option value="porvorim">Porvorim, Goa</option>
                <option value="margao">Margao, Goa</option>
                <option value="mandrem">Mandrem, Goa</option>
                <option value="goa">Goa (All Hubs)</option>
              </optgroup>
              <optgroup label="Telangana & Andhra Pradesh">
                <option value="hyderabad">Hyderabad, Telangana</option>
                <option value="warangal">Warangal, Telangana</option>
                <option value="karimnagar">Karimnagar, Telangana</option>
                <option value="khammam">Khammam, Telangana</option>
                <option value="nizamabad">Nizamabad, Telangana</option>
                <option value="mahbubnagar">Mahbubnagar, Telangana</option>
                <option value="telangana">Telangana (All Hubs)</option>
                <option value="visakhapatnam">Visakhapatnam (Vizag), AP</option>
                <option value="vijayawada">Vijayawada, AP</option>
                <option value="guntur">Guntur, AP</option>
                <option value="kakinada">Kakinada, AP</option>
                <option value="tirupati">Tirupati, AP</option>
                <option value="anantapur">Anantapur, AP</option>
                <option value="andhra_pradesh">Andhra Pradesh (All Hubs)</option>
              </optgroup>
              <optgroup label="Tamil Nadu & Kerala">
                <option value="chennai">Chennai, Tamil Nadu</option>
                <option value="coimbatore">Coimbatore, Tamil Nadu</option>
                <option value="hosur">Hosur, Tamil Nadu</option>
                <option value="madurai">Madurai, Tamil Nadu</option>
                <option value="tiruchirappalli">Tiruchirappalli (Trichy), TN</option>
                <option value="salem">Salem, Tamil Nadu</option>
                <option value="tirunelveli">Tirunelveli, Tamil Nadu</option>
                <option value="tamil_nadu">Tamil Nadu (All Hubs)</option>
                <option value="thiruvananthapuram">Thiruvananthapuram, Kerala</option>
                <option value="kochi">Kochi, Kerala</option>
                <option value="kozhikode">Kozhikode (Calicut), Kerala</option>
                <option value="thrissur">Thrissur, Kerala</option>
                <option value="palakkad">Palakkad, Kerala</option>
                <option value="kannur">Kannur, Kerala</option>
                <option value="kerala">Kerala (All Hubs)</option>
              </optgroup>
              <optgroup label="Work Mode & Scope">
                <option value="remote">Remote (India & Worldwide)</option>
                <option value="india">All India (Pan-India)</option>
              </optgroup>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Work Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Any Work Mode</option>
              <option value={WorkMode.REMOTE}>Remote</option>
              <option value={WorkMode.HYBRID}>Hybrid</option>
              <option value={WorkMode.ON_SITE}>On-Site (Office)</option>
            </select>
          </div>

          {/* Freshness Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Freshness
            </label>
            <select
              value={freshnessFilter}
              onChange={(e) => setFreshnessFilter(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Any Time</option>
              <option value="24H">Active in last 24h ⚡</option>
              <option value="3D">Past 3 days</option>
              <option value="7D">Past 7 days</option>
            </select>
          </div>

          {/* Verification & ATS Toggles */}
          <div className="flex flex-col justify-end gap-1.5">
            <label className="min-h-[38px] inline-flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-700 select-none px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={onlyDirectAts}
                onChange={(e) => setOnlyDirectAts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Zap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Direct ATS Links Only</span>
            </label>
            <label className="min-h-[38px] inline-flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-700 select-none px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Verified Companies</span>
            </label>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Active:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Keyword: &quot;{searchTerm}&quot;
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSearchTerm("")} />
              </span>
            )}
            {selectedType !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Type: {selectedType.replace("_", " ")}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedType("ALL")} />
              </span>
            )}
            {selectedExp !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Exp: {selectedExp === "0" ? "Fresher" : `${selectedExp} Yrs`}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedExp("ALL")} />
              </span>
            )}
            {selectedLocation !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Location: {
                  selectedLocation === "delhi_ncr"
                    ? "Delhi NCR"
                    : selectedLocation === "greater_noida"
                    ? "Greater Noida"
                    : selectedLocation === "navi_mumbai"
                    ? "Navi Mumbai"
                    : selectedLocation === "nava_raipur"
                    ? "Nava Raipur"
                    : selectedLocation === "west_bengal"
                    ? "West Bengal"
                    : selectedLocation === "northeast" || selectedLocation === "seven_sisters"
                    ? "Northeast / 7 Sisters"
                    : selectedLocation === "uttar_pradesh"
                    ? "Uttar Pradesh"
                    : selectedLocation === "madhya_pradesh"
                    ? "Madhya Pradesh"
                    : selectedLocation === "himachal"
                    ? "Himachal Pradesh"
                    : selectedLocation === "andhra_pradesh"
                    ? "Andhra Pradesh"
                    : selectedLocation === "tamil_nadu"
                    ? "Tamil Nadu"
                    : selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)
                }
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedLocation("ALL")} />
              </span>
            )}
            {selectedMode !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Mode: {selectedMode.replace("_", " ")}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedMode("ALL")} />
              </span>
            )}
            {onlyVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Verified Only
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setOnlyVerified(false)} />
              </span>
            )}
            {onlyDirectAts && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Direct ATS Links
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setOnlyDirectAts(false)} />
              </span>
            )}
            {freshnessFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Freshness: {freshnessFilter === "24H" ? "Last 24h" : freshnessFilter === "3D" ? "Past 3 Days" : "Past 7 Days"}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setFreshnessFilter("ALL")} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* JOBS CONTENT: DIVERSIFIED FEED, GROUPED BY COMPANY, OR RECOMMENDED */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-5 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-1/3 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "COMPANY_GROUPED" ? (
          /* COMPANY GROUPED VIEW */
          companyGroups.length > 0 ? (
            <div className="space-y-4">
              {companyGroups.map((group, idx) => (
                <CompanyJobGroupCard
                  key={group.companyName}
                  group={group}
                  defaultExpanded={idx === 0}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">
                No companies match your filters
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your location or work mode filters.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetAllFilters}>
                Reset Filters
              </Button>
            </div>
          )
        ) : viewMode === "RECOMMENDED" ? (
          /* RECOMMENDED VIEW (High Match Scores Only) */
          recommendedJobsWithScores.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-4">
                {paginatedRecommended.map(({ job }) => (
                  <JobCard key={job.id} job={job} candidateIntel={intelProfile} />
                ))}
              </div>

              {/* Recommended Pagination Bar */}
              {totalRecommendedPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200 text-xs text-slate-600">
                  <div className="font-mono font-medium">
                    Showing <span className="font-bold text-slate-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                    <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, recommendedJobsWithScores.length)}</span> of{" "}
                    <span className="font-bold text-slate-900">{recommendedJobsWithScores.length}</span> high-match roles
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalRecommendedPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalRecommendedPages || Math.abs(p - currentPage) <= 1)
                        .map((pageNumber, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const isEllipsis = prevPage && pageNumber - prevPage > 1;
                          return (
                            <div key={pageNumber} className="flex items-center gap-1">
                              {isEllipsis && <span className="px-1 text-slate-400">...</span>}
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentPage(pageNumber);
                                  window.scrollTo({ top: 380, behavior: "smooth" });
                                }}
                                className={`h-8 w-8 rounded-xl font-bold transition-all cursor-pointer ${
                                  currentPage === pageNumber
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalRecommendedPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalRecommendedPages, p + 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Zap className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">
                No high-match roles for this stack combination
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try adding more skills in the Candidate Intelligence Bar above or switch to Diversified Feed.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setViewMode("DIVERSIFIED")}
              >
                Show All Opportunities
              </Button>
            </div>
          )
        ) : (
          /* DIVERSIFIED FEED VIEW (Round-Robin Interleaved) */
          diversifiedJobs.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} candidateIntel={intelProfile} />
                ))}
              </div>

              {/* Diversified Feed Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200 text-xs text-slate-600">
                  <div className="font-mono font-medium">
                    Showing <span className="font-bold text-slate-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                    <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, diversifiedJobs.length)}</span> of{" "}
                    <span className="font-bold text-slate-900">{diversifiedJobs.length}</span> opportunities
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((pageNumber, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const isEllipsis = prevPage && pageNumber - prevPage > 1;
                          return (
                            <div key={pageNumber} className="flex items-center gap-1">
                              {isEllipsis && <span className="px-1 text-slate-400">...</span>}
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentPage(pageNumber);
                                  window.scrollTo({ top: 380, behavior: "smooth" });
                                }}
                                className={`h-8 w-8 rounded-xl font-bold transition-all cursor-pointer ${
                                  currentPage === pageNumber
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">
                No matching opportunities found
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search terms or clearing work mode filters.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetAllFilters}>
                Reset Filters
              </Button>
            </div>
          )
        )}
      </div>

      {/* TRUTH TELLER GUARANTEE CALLOUT */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white px-4 py-3 text-xs text-emerald-950 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-emerald-900 font-mono flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Truth Teller Standard:
          </span>
          <span className="text-slate-700">
            Direct application tracking with real-time status updates and zero recruiter ghosting.
          </span>
        </div>
        <Link
          href="/transparency"
          className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 flex items-center gap-1"
        >
          Anti-Ghosting Ledger &rarr;
        </Link>
      </div>

      {/* INSTANT WHATSAPP & TELEGRAM ALERTS */}
      <InstantAlertsBanner />
    </div>
    </>
  );
}
