/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReadingLevelId,
  QuestionData,
  PupilSession,
  SessionResultItem,
} from './types/game';
import {
  generateQuestion,
  LEVEL_METADATA,
} from './data/wordBank';
import {
  getWordsByLevel,
  getStoredPupilName,
  saveStoredPupilName,
  getStoredCarColor,
  saveStoredCarColor,
  getTeacherSettings,
  saveSessionRecord,
} from './utils/storage';
import { RoadScene } from './components/3d/RoadScene';
import { GameHUD } from './components/hud/GameHUD';
import { LearningCheckpointModal } from './components/learning/LearningCheckpointModal';
import { StartScreen } from './components/screens/StartScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { sfx } from './utils/audio';

type ScreenMode = 'start' | 'game' | 'summary';

export default function App() {
  // Global Profile State
  const [screen, setScreen] = useState<ScreenMode>('start');
  const [pupilName, setPupilName] = useState<string>(getStoredPupilName());
  const [selectedLevel, setSelectedLevel] = useState<ReadingLevelId>(1);
  const [carColor, setCarColor] = useState<string>(getStoredCarColor());
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);

  // Active Game State
  const [activeLane, setActiveLane] = useState<number>(1); // 0: Left, 1: Center, 2: Right
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Session & Questions
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isCheckpointActive, setIsCheckpointActive] = useState<boolean>(false);
  const [sessionResults, setSessionResults] = useState<SessionResultItem[]>([]);
  const [completedSession, setCompletedSession] = useState<PupilSession | null>(null);

  // Highway Distances
  const [distanceTraveled, setDistanceTraveled] = useState<number>(0);
  const [distanceToCheckpoint, setDistanceToCheckpoint] = useState<number>(
    LEVEL_METADATA[1].checkpointDist
  );

  const teacherSettings = useMemo(() => getTeacherSettings(), [isTeacherDashboardOpen]);

  // Persist name and car color changes
  const handleUpdatePupilName = (name: string) => {
    setPupilName(name);
    saveStoredPupilName(name);
  };

  const handleSelectCarColor = (color: string) => {
    setCarColor(color);
    saveStoredCarColor(color);
  };

  // Prepare a new session of questions
  const startNewGameSession = useCallback(() => {
    const levelWords = getWordsByLevel(selectedLevel);
    if (levelWords.length === 0) return;

    // Shuffle and pick target questions for this session
    const shuffledWords = [...levelWords].sort(() => 0.5 - Math.random());
    const count = Math.min(teacherSettings.questionsPerSession, shuffledWords.length);
    const chosenWords = shuffledWords.slice(0, count);

    // If needed, cycle through words to fill target question count
    while (chosenWords.length < count && levelWords.length > 0) {
      chosenWords.push(levelWords[chosenWords.length % levelWords.length]);
    }

    const generated = chosenWords.map((wordItem) =>
      generateQuestion(wordItem, levelWords)
    );

    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStars(0);
    setStreak(0);
    setSessionResults([]);
    setIsCheckpointActive(false);
    setActiveLane(1);
    setDistanceTraveled(0);
    setDistanceToCheckpoint(LEVEL_METADATA[selectedLevel].checkpointDist);
    setIsPaused(false);
    setScreen('game');
  }, [selectedLevel, teacherSettings.questionsPerSession]);

  // When 3D car reaches the checkpoint distance
  const handleTriggerCheckpoint = useCallback(() => {
    if (isCheckpointActive || questions.length === 0) return;
    setIsCheckpointActive(true);
  }, [isCheckpointActive, questions.length]);

  // Handle Answer confirmation from the learning checkpoint
  const handleAnswerSubmitted = (
    selectedIndex: number,
    isFirstAttempt: boolean,
    attempts: number
  ) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    // Calculate score for this question (100, 50, 25, 0)
    let points = 0;
    if (attempts === 1) points = 100;
    else if (attempts === 2) points = 50;
    else points = 25;

    const newScore = score + points;
    setScore(newScore);

    const newStreak = isFirstAttempt ? streak + 1 : 0;
    setStreak(newStreak);

    // Award star for good streaks or milestones
    if (newStreak > 0 && newStreak % 3 === 0) {
      setStars((prev) => Math.min(3, prev + 1));
    }

    const resultItem: SessionResultItem = {
      questionId: currentQ.id,
      word: currentQ.item.word,
      level: currentQ.item.level,
      pattern: currentQ.item.pattern,
      type: currentQ.type,
      attempts,
      isFirstAttemptCorrect: isFirstAttempt,
      scoreEarned: points,
      timeSpentSeconds: 0,
    };

    const updatedResults = [...sessionResults, resultItem];
    setSessionResults(updatedResults);

    // Pass the 3D gate
    sfx.playGatePass();
    setIsCheckpointActive(false);

    // Check if session is finished
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) {
      // Completed all questions in session!
      const firstAttemptCount = updatedResults.filter((r) => r.isFirstAttemptCorrect).length;
      const assistedCount = updatedResults.filter((r) => !r.isFirstAttemptCorrect).length;
      const accuracy = Math.round((firstAttemptCount / questions.length) * 100);

      let finalStars = 1;
      if (accuracy >= 80) finalStars = 3;
      else if (accuracy >= 50) finalStars = 2;

      const finalSession: PupilSession = {
        id: `session_${Date.now()}`,
        timestamp: Date.now(),
        pupilName: pupilName.trim() || 'Juara Baca',
        level: selectedLevel,
        totalQuestions: questions.length,
        firstAttemptCorrectCount: firstAttemptCount,
        assistedCorrectCount: assistedCount,
        totalScore: newScore,
        stars: finalStars,
        results: updatedResults,
      };

      saveSessionRecord(finalSession);
      setCompletedSession(finalSession);

      setTimeout(() => {
        setScreen('summary');
      }, 1200);
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handleLaneChange = (laneIndex: number) => {
    setActiveLane(laneIndex);
  };

  const handleDistanceUpdate = useCallback((traveled: number, toCheckpoint: number) => {
    setDistanceTraveled(traveled);
    setDistanceToCheckpoint(toCheckpoint);
  }, []);

  const activeQuestion = questions[currentQuestionIndex] || null;

  return (
    <main className="w-full h-[100dvh] min-h-[100dvh] relative bg-slate-950 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] select-none">
      {/* 1. START SCREEN */}
      {screen === 'start' && (
        <StartScreen
          pupilName={pupilName}
          onUpdatePupilName={handleUpdatePupilName}
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          carColor={carColor}
          onSelectCarColor={handleSelectCarColor}
          onStartGame={startNewGameSession}
          onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        />
      )}

      {/* 2. GAME SCREEN (Real-time 3D Highway & HUD) */}
      {screen === 'game' && (
        <div className="relative w-full h-full">
          {/* 3D Highway Canvas */}
          <RoadScene
            carColor={carColor}
            isPaused={isPaused}
            isCheckpointActive={isCheckpointActive}
            currentQuestion={activeQuestion}
            onLaneSelectedByCar={handleLaneChange}
            targetLane={activeLane}
            onDistanceUpdate={handleDistanceUpdate}
            checkpointDistance={LEVEL_METADATA[selectedLevel].checkpointDist}
            onTriggerCheckpoint={handleTriggerCheckpoint}
          />

          {/* Heads-Up Display (Score, stars, lane buttons, pause) */}
          <GameHUD
            pupilName={pupilName}
            level={selectedLevel}
            score={score}
            stars={stars}
            streak={streak}
            currentQuestionIndex={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            distanceToCheckpoint={distanceToCheckpoint}
            activeLane={activeLane}
            onLaneSelect={handleLaneChange}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
            onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
            activeQuestion={activeQuestion}
          />

          {/* Educational Checkpoint Learning Modal */}
          {isCheckpointActive && activeQuestion && (
            <LearningCheckpointModal
              question={activeQuestion}
              activeLane={activeLane}
              onAnswerSubmitted={handleAnswerSubmitted}
              onLaneChange={handleLaneChange}
              highlightSyllablesByColor={teacherSettings.highlightSyllablesByColor}
            />
          )}
        </div>
      )}

      {/* 3. SUMMARY SCREEN */}
      {screen === 'summary' && completedSession && (
        <SummaryScreen
          session={completedSession}
          onPlayAgain={startNewGameSession}
          onGoHome={() => setScreen('start')}
          onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        />
      )}

      {/* 4. TEACHER DASHBOARD MODAL */}
      {isTeacherDashboardOpen && (
        <TeacherDashboard
          onClose={() => setIsTeacherDashboardOpen(false)}
          onRefreshWords={() => {
            // refresh active word bank if needed
          }}
        />
      )}
    </main>
  );
}
