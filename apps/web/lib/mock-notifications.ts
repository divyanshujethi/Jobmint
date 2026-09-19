export interface InAppNotification {
  id: string;
  type: "VIEWED" | "SHORTLISTED" | "INTERVIEW" | "GHOSTING" | "MATCH";
  title: string;
  message: string;
  timestampAgo: string;
  isRead: boolean;
  linkUrl: string;
}

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: "notif-1",
    type: "VIEWED",
    title: "Resume Viewed by ABC Technologies",
    message: "A lead engineer at ABC Technologies opened and reviewed your resume for Frontend Developer Intern.",
    timestampAgo: "2 hours ago",
    isRead: false,
    linkUrl: "/applications",
  },
  {
    id: "notif-2",
    type: "SHORTLISTED",
    title: "You Were Shortlisted!",
    message: "ABC Technologies marked your application as Shortlisted for the technical evaluation round.",
    timestampAgo: "1 day ago",
    isRead: false,
    linkUrl: "/applications",
  },
  {
    id: "notif-3",
    type: "GHOSTING",
    title: "Truth Teller 7-Day Inactivity Alert",
    message: "PocketByte Apps has not viewed your application in 8 days. Click to discover 12 similar active roles.",
    timestampAgo: "2 days ago",
    isRead: false,
    linkUrl: "/applications",
  },
  {
    id: "notif-4",
    type: "MATCH",
    title: "New 94% Compatibility Match",
    message: "NeuralFlow Labs just posted AI & Deep Learning Intern matching your Python & PyTorch skills.",
    timestampAgo: "3 days ago",
    isRead: true,
    linkUrl: "/jobs/ai-research-engineer-intern-neuralflow",
  },
];
