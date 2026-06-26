export interface ResourceLink {
  label: string;
  href?: string;
  featured?: boolean;
}

export interface Lesson {
  number: number;
  title: string;
  summary: string;
  tags: string[];
  searchKeywords: string;
  resources: ResourceLink[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  correct: string;
}

export interface LibraryBlock {
  title: string;
  items: ResourceLink[];
}

export interface Course {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  heroTitle: string;
  status: 'active' | 'coming-soon';
  accent?: string;
  lessons: Lesson[];
  quiz?: QuizQuestion[];
  library?: LibraryBlock[];
}

export interface CourseMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  status: 'active' | 'coming-soon';
  lessonCount: number;
  accent?: string;
}

export interface SessionPayload {
  username: string;
  exp: number;
}
