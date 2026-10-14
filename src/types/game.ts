export type ReadingLevelId = 1 | 2 | 3 | 4 | 5;

export type QuestionType = 'blend' | 'parts' | 'picture' | 'listen';

export interface SyllableSegment {
  text: string;
  colorClass?: string;
}

export interface WordItem {
  id: string;
  level: ReadingLevelId;
  pattern: 'KV+KV' | 'KVKV+KV' | 'KV+KVK' | 'KVK+KV' | 'KVK+KVK+KVK';
  word: string;
  syllables: string[]; // e.g. ["bu", "ku"] or ["ke", "re", "ta"]
  displayGrouping: string; // e.g. "bu + ku" or "kere + ta"
  meaningOrPictureDescription: string;
  audioText: string;
  questionTypes: QuestionType[];
  illustrationKey?: string;
  isCustom?: boolean;
}

export interface QuestionData {
  id: string;
  item: WordItem;
  type: QuestionType;
  prompt: string;
  displayExpression: string;
  options: string[]; // 3 options: [Lane A, Lane B, Lane C]
  correctAnswer: string;
  correctIndex: number;
  explanation: string;
}

export interface SessionResultItem {
  questionId: string;
  word: string;
  level: ReadingLevelId;
  pattern: string;
  type: QuestionType;
  attempts: number;
  isFirstAttemptCorrect: boolean;
  scoreEarned: number;
  timeSpentSeconds: number;
}

export interface PupilSession {
  id: string;
  timestamp: number;
  pupilName: string;
  level: ReadingLevelId;
  totalQuestions: number;
  firstAttemptCorrectCount: number;
  assistedCorrectCount: number;
  totalScore: number;
  stars: number;
  results: SessionResultItem[];
}

export interface PupilMasteryRecord {
  pupilName: string;
  level: ReadingLevelId;
  sessionsCompleted: number;
  totalQuestionsAttempted: number;
  totalFirstAttemptCorrect: number;
  troubledWords: Record<string, number>; // word -> count of mistakes
  masteredWords: string[];
  lastSessionDate: string;
  bestScore: number;
  bestStars: number;
}

export interface TeacherSettings {
  masteryAccuracyThresholdPercent: number; // e.g. 80%
  questionsPerSession: number; // e.g. 6, 8, 10
  allowLaneSteeringSelection: boolean;
  speechRate: number; // 0.7 - 1.0 (slower for remedial pupils)
  speechPitch: number;
  highlightSyllablesByColor: boolean;
  teacherPin: string;
}
