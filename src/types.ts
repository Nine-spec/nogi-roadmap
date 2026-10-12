export type Status = 'none' | 'progress' | 'mastered';
export type Skill = 'wrestling' | 'passing' | 'guard' | 'escapes' | 'submissions';
export type TechKind = 'technique' | 'submission';

export interface Technique {
  id: string;
  name: string;
  kind: TechKind;
  skills: Skill[];
  cue: string;
}

export interface TechGroup {
  label: string;
  items: Technique[];
}

export interface Objective {
  id: string;
  label: string;
}

export interface Phase {
  id: string;
  num: number;
  months: string;
  title: string;
  tagline: string;
  groups: TechGroup[];
  objectives: Objective[];
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  partners: string;
  techniques: string;
  submissions: number;
  submissionTypes: string[];
  takedowns: number;
  doubleLegs: number;
  beatBlueBelt: boolean;
  difficulties: string;
  lessons: string;
}

export type VideoFlag = 'seen' | 'fav' | 'study';

export interface ChainStep {
  id: string;
  techName: string;
}

export interface Chain {
  id: string;
  name: string;
  weight: number;
  steps: ChainStep[];
}

export interface AppState {
  version: 1;
  startDate: string;
  techniques: Record<string, Status>;
  objectives: Record<string, boolean>;
  journal: JournalEntry[];
  videos: Record<string, VideoFlag[]>;
  chains: Chain[];
  seenAchievements: string[];
  favTips: number[];
  sound: boolean;
  celebratedBlueBelt: boolean;
}
