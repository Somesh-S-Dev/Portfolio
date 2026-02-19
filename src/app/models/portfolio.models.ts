export interface Profile {
  name: string;
  tagline: string;
  brief: string;
  email: string;
  linkedin: string;
  github: string;
  instagram: string;
  currentRole: string;
  currentCompany: string;
  dateOfJoining: string;
  address: string;
  companyAddress: string;
  resumeUrl: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  stream: string;
  cgpa: string;
  yearStart: number;
  yearEnd: number;
  location: string;
  image: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  logo: string;
  role: string;
  type: 'internship' | 'full-time' | 'part-time' | 'contract';
  dateFrom: string;
  dateTo: string | null;
  location: string;
  description: string;
  tasks: string[];
  projects: string[];
  techStack: string[];
  certificateImage: string;
}

export interface Certification {
  id: string;
  title: string;
  provider: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  image: string;
  bgImage: string;
}

export interface Badge {
  id: string;
  title: string;
  issuer: string;
  earnedDate: string;
  image: string;
  credlyUrl: string;
  description: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: { name: string } | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  readme?: string;
}

export interface ContactSession {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  avatarUrl?: string;
}

export interface ContactMessage {
  id: string;
  message: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export interface TimelineEvent {
  id: string;
  date: string;          // ISO format: "2021-08"
  label: string;         // Short milestone title
  detail: string;        // Longer description shown on hover/expand
  type: 'education' | 'work' | 'certification' | 'project' | 'achievement';
  icon: string;          // FontAwesome icon class e.g. "fa-graduation-cap"
  sectionId: string;     // Page section to scroll to on click
  highlight: boolean;    // Whether to visually emphasise this node
}

export type WeatherCondition = 'none' | 'sunny' | 'cloudy' | 'rain' | 'breeze' | 'snow' | 'unknown';
export type TimeTheme = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';
export type ThemeMode = 'dynamic' | 'light' | 'dark';
