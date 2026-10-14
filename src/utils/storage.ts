import { WordItem, PupilSession, PupilMasteryRecord, TeacherSettings, ReadingLevelId } from '../types/game';
import { DEFAULT_WORD_BANK } from '../data/wordBank';

const STORAGE_KEYS = {
  PUPIL_NAME: 'misi_baca_pupil_name',
  SESSIONS: 'misi_baca_sessions_history',
  MASTERY_RECORDS: 'misi_baca_mastery_records',
  CUSTOM_WORDS: 'misi_baca_custom_words',
  TEACHER_SETTINGS: 'misi_baca_teacher_settings',
  CAR_COLOR: 'misi_baca_car_color',
};

export const DEFAULT_TEACHER_SETTINGS: TeacherSettings = {
  masteryAccuracyThresholdPercent: 80,
  questionsPerSession: 8,
  allowLaneSteeringSelection: true,
  speechRate: 0.82,
  speechPitch: 1.0,
  highlightSyllablesByColor: true,
  teacherPin: '1234',
};

export function getStoredPupilName(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.PUPIL_NAME) || 'Juara Baca';
  } catch {
    return 'Juara Baca';
  }
}

export function saveStoredPupilName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PUPIL_NAME, name.trim() || 'Juara Baca');
  } catch (e) {
    console.error('Failed to save pupil name', e);
  }
}

export function getStoredCarColor(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CAR_COLOR) || '#ea580c';
  } catch {
    return '#ea580c';
  }
}

export function saveStoredCarColor(color: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CAR_COLOR, color);
  } catch (e) {
    console.error('Failed to save car color', e);
  }
}

export function getTeacherSettings(): TeacherSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_SETTINGS);
    if (raw) {
      return { ...DEFAULT_TEACHER_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed reading teacher settings', e);
  }
  return DEFAULT_TEACHER_SETTINGS;
}

export function saveTeacherSettings(settings: TeacherSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed saving teacher settings', e);
  }
}

export function getAllWordItems(): WordItem[] {
  try {
    const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
    const customWords: WordItem[] = customRaw ? JSON.parse(customRaw) : [];
    // Combine defaults and custom words
    const map = new Map<string, WordItem>();
    DEFAULT_WORD_BANK.forEach((w) => map.set(w.id, w));
    customWords.forEach((w) => map.set(w.id, { ...w, isCustom: true }));
    return Array.from(map.values());
  } catch (e) {
    console.error('Failed loading words', e);
    return DEFAULT_WORD_BANK;
  }
}

export function getWordsByLevel(level: ReadingLevelId): WordItem[] {
  return getAllWordItems().filter((item) => item.level === level);
}

export function saveCustomWord(item: WordItem): void {
  try {
    const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
    const customWords: WordItem[] = customRaw ? JSON.parse(customRaw) : [];
    const index = customWords.findIndex((w) => w.id === item.id);
    if (index >= 0) {
      customWords[index] = { ...item, isCustom: true };
    } else {
      customWords.push({ ...item, isCustom: true });
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(customWords));
  } catch (e) {
    console.error('Failed saving custom word', e);
  }
}

export function deleteCustomWord(wordId: string): void {
  try {
    const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
    if (!customRaw) return;
    const customWords: WordItem[] = JSON.parse(customRaw);
    const filtered = customWords.filter((w) => w.id !== wordId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed deleting custom word', e);
  }
}

export function getSessionHistory(): PupilSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessionRecord(session: PupilSession): void {
  try {
    const history = getSessionHistory();
    history.unshift(session);
    // Keep last 50 sessions
    const trimmed = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(trimmed));

    // Update aggregate mastery records for pupil
    updatePupilMastery(session);
  } catch (e) {
    console.error('Failed saving session', e);
  }
}

export function getMasteryRecords(): Record<string, PupilMasteryRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MASTERY_RECORDS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function updatePupilMastery(session: PupilSession): void {
  const records = getMasteryRecords();
  const key = `${session.pupilName.toLowerCase()}__level${session.level}`;
  const existing: PupilMasteryRecord = records[key] || {
    pupilName: session.pupilName,
    level: session.level,
    sessionsCompleted: 0,
    totalQuestionsAttempted: 0,
    totalFirstAttemptCorrect: 0,
    troubledWords: {},
    masteredWords: [],
    lastSessionDate: new Date().toLocaleDateString('ms-MY'),
    bestScore: 0,
    bestStars: 0,
  };

  existing.sessionsCompleted += 1;
  existing.totalQuestionsAttempted += session.totalQuestions;
  existing.totalFirstAttemptCorrect += session.firstAttemptCorrectCount;
  existing.lastSessionDate = new Date().toLocaleDateString('ms-MY');
  existing.bestScore = Math.max(existing.bestScore, session.totalScore);
  existing.bestStars = Math.max(existing.bestStars, session.stars);

  const troubled = { ...existing.troubledWords };
  const masteredSet = new Set(existing.masteredWords);

  session.results.forEach((res) => {
    if (res.isFirstAttemptCorrect) {
      masteredSet.add(res.word);
    } else {
      troubled[res.word] = (troubled[res.word] || 0) + 1;
    }
  });

  existing.troubledWords = troubled;
  existing.masteredWords = Array.from(masteredSet);

  records[key] = existing;
  localStorage.setItem(STORAGE_KEYS.MASTERY_RECORDS, JSON.stringify(records));
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.MASTERY_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_WORDS);
  } catch (e) {
    console.error('Failed resetting data', e);
  }
}
