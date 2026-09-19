import { CandidateMatchProfile } from "@repo/matching";
import { WorkMode } from "@repo/shared";

// Active candidate profile (in Phase 1 onboarding, default student state)
export const CURRENT_CANDIDATE_PROFILE: CandidateMatchProfile = {
  id: "candidate-1",
  skills: ["React", "TypeScript", "Next.js", "Python", "Git", "Tailwind CSS"],
  experienceYears: 0,
  isFresher: true,
  projects: [
    {
      title: "Full-Stack Job Platform",
      skillsUsed: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Python ML Classifier",
      skillsUsed: ["Python", "Pandas & NumPy"],
    },
  ],
  location: "Bangalore / Remote",
  preferredWorkModes: [WorkMode.REMOTE, WorkMode.HYBRID],
  preferredRoles: ["Frontend Developer Intern", "AI Engineer"],
  expectedSalaryMin: 20000,
  educationField: "Computer Science",
};
