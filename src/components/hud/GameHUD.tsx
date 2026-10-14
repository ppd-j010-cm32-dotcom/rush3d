import React, { useState } from 'react';
import { Star, Trophy, Flame, Volume2, VolumeX, Pause, Play, Bell } from 'lucide-react';
import { ReadingLevelId, QuestionData } from '../../types/game';
import { LEVEL_METADATA } from '../../data/wordBank';
import { speechEngine, sfx } from '../../utils/audio';

interface GameHUDProps {
  pupilName: string;
  level: ReadingLevelId;
  score: number;
  stars: number;
  streak: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  distanceToCheckpoint: number;
  activeLane: number;
  onLaneSelect: (lane: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenTeacherDashboard: () => void;
  activeQuestion?: QuestionData | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  pupilName,
  level,
  score,
  stars,
  streak,
  currentQuestionIndex,
  totalQuestions,
  distanceToCheckpoint,
  activeLane,
  onLaneSelect,
  isPaused,
  onTogglePause,
  onOpenTeacherDashboard,
  activeQuestion,
}) => {
  const [isMuted, setIsMuted] = useState(sfx.getMuted());
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);

  const levelInfo = LEVEL_METADATA[level];

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sfx.setMuted(next);
  };

  const handleHorn = () => {
    sfx.playCarHorn();
  };

  const handleSteerLeft = () => {
    const next = Math.max(0, activeLane - 1);
    onLaneSelect(next);
  };

  const handleSteerRight = () => {
    const next = Math.min(2, activeLane + 1);
    onLaneSelect(next);
  };

  const handleSpeakQuestion = async () => {
    if (!activeQuestion || isSpeakingPrompt) return;
    setIsSpeakingPrompt(true);
    await speechEngine.readSyllablesAndWord(
      activeQuestion.item.syllables,
      activeQuestion.item.word,
      0.8
    );
    setIsSpeakingPrompt(false);
  };

  const progressPercent = Math.min(100, Math.round(((currentQuestionIndex) / totalQuestions) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-5 pt-safe pb-safe pl-safe pr-safe z-20 select-none">
      {/* TOP SECTION: STATUS BAR & MISSION BANNER */}
      <div className="w-full flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Status Bar */}
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Left: Player Profile & Level */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl shadow-md border border-sky-100 max-w-[50%] sm:max-w-none">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs sm:text-base shadow-inner shrink-0">
              {pupilName.charAt(0).toUpperCase() || 'M'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate max-w-[80px] sm:max-w-[130px]">
                  {pupilName || 'Murid'}
                </span>
                <span className={`text-[8px] sm:text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full shrink-0 ${levelInfo.badgeBg}`}>
                  {levelInfo.patternDisplay}
                </span>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-14 sm:w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-500 shrink-0">
                  {currentQuestionIndex}/{totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Distance to next checkpoint */}
          <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl shadow-md border border-sky-500/30">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-sky-300 font-bold hidden sm:inline">Papan Tanda:</span>
            <span className="text-xs sm:text-sm font-black text-yellow-400">{distanceToCheckpoint}m</span>
          </div>

          {/* Right: Gamification Badges & Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Score & Stars */}
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-2xl shadow-md border border-sky-100">
              <div className="flex items-center gap-0.5 text-amber-500 font-black text-[11px] sm:text-sm">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                <span>{stars}</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-0.5 text-sky-600 font-black text-[11px] sm:text-sm">
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{score}</span>
              </div>
              {streak > 1 && (
                <>
                  <div className="h-3 w-px bg-slate-200" />
                  <div className="flex items-center gap-0.5 text-rose-500 font-black text-[9px] sm:text-xs">
                    <Flame className="w-3 h-3 fill-rose-500 animate-bounce" />
                    <span>x{streak}</span>
                  </div>
                </>
              )}
            </div>

            {/* Audio toggle */}
            <button
              onClick={handleToggleMute}
              className="p-1.5 sm:p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200 transition-all active:scale-95"
              title={isMuted ? 'Buka Bunyi' : 'Senyapkan'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-sky-600" />}
            </button>

            {/* Pause */}
            <button
              onClick={onTogglePause}
              className="p-1.5 sm:p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200 transition-all active:scale-95"
              title={isPaused ? 'Sambung' : 'Jeda'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
            </button>

            {/* Teacher Mode Button */}
            <button
              onClick={onOpenTeacherDashboard}
              className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] sm:text-xs font-bold shadow-md transition-all active:scale-95 border border-slate-700"
            >
              Guru
            </button>
          </div>
        </div>

        {/* PROMINENT TARGET MISSION BANNER: Apa soalan / perkataan yang perlu dicari */}
        {activeQuestion && (
          <div className="w-full max-w-xl bg-gradient-to-r from-slate-900/90 via-sky-950/90 to-slate-900/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-xl border-2 border-sky-400 flex items-center justify-between gap-2 transition-all">
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-amber-400 text-slate-950 text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                MISI
              </span>
              <div className="min-w-0">
                <p className="text-white text-xs sm:text-sm font-black truncate drop-shadow">
                  {activeQuestion.prompt}
                </p>
                <p className="text-sky-300 text-[10px] sm:text-xs font-bold truncate">
                  {activeQuestion.type === 'blend'
                    ? `Cantumkan suku kata: ${activeQuestion.item.displayGrouping} = ?`
                    : activeQuestion.type === 'picture'
                    ? `Cari perkataan bagi: ${activeQuestion.item.meaningOrPictureDescription}`
                    : `Dengar sebutan perkataan dan pandu ke lorong yang tepat`}
                </p>
              </div>
            </div>

            <button
              onClick={handleSpeakQuestion}
              disabled={isSpeakingPrompt}
              className={`px-2.5 py-1 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 shadow active:scale-95 transition-all ${
                isSpeakingPrompt
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : 'bg-sky-500 hover:bg-sky-400 text-white'
              }`}
              title="Dengar bunyi soalan"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">{isSpeakingPrompt ? 'Membaca...' : 'Dengar'}</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS: Uncluttered, transparent in center to reveal road and player car */}
      <div className="w-full pointer-events-auto">
        {/* MOBILE CONTROLS (Floating thumb corner pads + lane indicator) */}
        <div className="flex sm:hidden items-end justify-between w-full px-1 pb-1">
          {/* Steer Left Floating Thumb Pad */}
          <button
            onClick={handleSteerLeft}
            disabled={activeLane === 0}
            className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center font-black shadow-2xl border-2 transition-all active:scale-90 ${
              activeLane === 0
                ? 'bg-slate-900/40 text-slate-500 border-slate-700/50 opacity-40'
                : 'bg-white/95 text-sky-700 border-sky-400 ring-2 ring-sky-300 shadow-sky-500/30'
            }`}
            title="Tukar ke Lorong Kiri"
          >
            <span className="text-xl leading-none">◀</span>
            <span className="text-[9px] font-extrabold uppercase mt-0.5">Kiri</span>
          </button>

          {/* Center: Current Lane Indicator & Quick Horn */}
          <div className="flex flex-col items-center gap-1 mb-0.5">
            <div className="bg-slate-950/80 backdrop-blur-md border border-sky-400/50 text-white px-3 py-1 rounded-full text-[10px] font-extrabold shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Lorong {activeLane + 1} ({String.fromCharCode(65 + activeLane)})</span>
            </div>
            <button
              onClick={handleHorn}
              className="px-3 py-1 bg-amber-400/90 active:bg-amber-300 text-slate-950 rounded-full font-black text-[10px] shadow flex items-center gap-1 active:scale-95"
            >
              <Bell className="w-3 h-3 fill-slate-950" />
              <span>HON</span>
            </button>
          </div>

          {/* Steer Right Floating Thumb Pad */}
          <button
            onClick={handleSteerRight}
            disabled={activeLane === 2}
            className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center font-black shadow-2xl border-2 transition-all active:scale-90 ${
              activeLane === 2
                ? 'bg-slate-900/40 text-slate-500 border-slate-700/50 opacity-40'
                : 'bg-white/95 text-sky-700 border-sky-400 ring-2 ring-sky-300 shadow-sky-500/30'
            }`}
            title="Tukar ke Lorong Kanan"
          >
            <span className="text-xl leading-none">▶</span>
            <span className="text-[9px] font-extrabold uppercase mt-0.5">Kanan</span>
          </button>
        </div>

        {/* LAPTOP / DESKTOP CONTROLS (Sleek translucent floating pill) */}
        <div className="hidden sm:flex items-center justify-center w-full pb-1">
          <div className="bg-slate-950/75 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-sky-500/40 flex items-center gap-3">
            {/* Horn button */}
            <button
              onClick={handleHorn}
              className="p-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl flex items-center gap-1 text-xs font-black shadow active:scale-95 transition-all"
              title="Bunyikan Hon Kereta (Kekunci H)"
            >
              <Bell className="w-3.5 h-3.5 fill-slate-950" />
              <span>Hon [H]</span>
            </button>

            {/* 3 Lane Selection Buttons */}
            <div className="flex items-center gap-1.5">
              {[
                { lane: 0, label: 'Lorong 1 (A)', key: '1 / ◀' },
                { lane: 1, label: 'Lorong 2 (B)', key: '2' },
                { lane: 2, label: 'Lorong 3 (C)', key: '3 / ▶' },
              ].map(({ lane, label, key }) => {
                const isActive = activeLane === lane;
                return (
                  <button
                    key={lane}
                    onClick={() => onLaneSelect(lane)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white ring-2 ring-sky-300 scale-105 shadow-md shadow-sky-500/40'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${isActive ? 'bg-sky-700 text-white' : 'bg-slate-900 text-slate-400'}`}>
                      {key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
