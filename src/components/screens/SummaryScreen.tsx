import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, Home, Volume2, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { PupilSession } from '../../types/game';
import { LEVEL_METADATA } from '../../data/wordBank';
import { speechEngine, sfx } from '../../utils/audio';

interface SummaryScreenProps {
  session: PupilSession;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onOpenTeacherDashboard: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  session,
  onPlayAgain,
  onGoHome,
  onOpenTeacherDashboard,
}) => {
  const levelInfo = LEVEL_METADATA[session.level];
  const firstAttemptPct = Math.round((session.firstAttemptCorrectCount / session.totalQuestions) * 100);

  useEffect(() => {
    sfx.playCelebrationFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handlePronounceWord = (word: string) => {
    speechEngine.speakText(word, 0.8);
  };

  const masteredItems = session.results.filter((r) => r.isFirstAttemptCorrect);
  const supportItems = session.results.filter((r) => !r.isFirstAttemptCorrect);

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-sky-400 via-sky-200 to-indigo-100 flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-6 py-4 sm:py-8 pt-safe pb-safe pl-safe pr-safe overflow-y-auto select-none">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 sm:border-4 border-white p-3.5 sm:p-8 flex flex-col items-center text-center my-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-slate-950 px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase mb-2 shadow-sm">
          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Misi Selesai • Laporan Pembelajaran</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-1">
          Tahniah, <span className="text-sky-600">{session.pupilName}</span>!
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-600 mb-3 sm:mb-5">{levelInfo.title}</p>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2.5 sm:p-3 rounded-2xl transition-all duration-300 ${
                starIdx <= session.stars
                  ? 'bg-amber-100 border-2 border-amber-400 scale-110 shadow-md animate-bounce'
                  : 'bg-slate-100 border-2 border-slate-200 opacity-40'
              }`}
            >
              <Star
                className={`w-7 h-7 sm:w-9 sm:h-9 ${
                  starIdx <= session.stars ? 'text-amber-500 fill-amber-400' : 'text-slate-400'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-sky-50 rounded-2xl p-2 sm:p-3 border border-sky-200 flex flex-col items-center justify-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-sky-700">Jumlah Mata</span>
            <div className="text-lg sm:text-2xl font-black text-sky-600 flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
              <span>{session.totalScore}</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-2 sm:p-3 border border-emerald-200 flex flex-col items-center justify-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-700">Tepat Pertama</span>
            <div className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5 sm:mt-1">
              {firstAttemptPct}%
            </div>
            <span className="text-[8px] sm:text-[10px] text-emerald-600 font-bold">
              {session.firstAttemptCorrectCount}/{session.totalQuestions} Soalan
            </span>
          </div>

          <div className="bg-purple-50 rounded-2xl p-2 sm:p-3 border border-purple-200 flex flex-col items-center justify-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-purple-700">Bimbingan</span>
            <div className="text-lg sm:text-2xl font-black text-purple-600 mt-0.5 sm:mt-1">
              {session.assistedCorrectCount}
            </div>
            <span className="text-[8px] sm:text-[10px] text-purple-600 font-bold">Dibantu</span>
          </div>
        </div>

        {/* Word Mastery Review */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase text-slate-700">Analisis Perkataan Sesi Ini:</h3>
            <span className="text-[11px] text-slate-500">Tekan pembesar suara untuk mendengar semula</span>
          </div>

          {/* Mastered Words */}
          {masteredItems.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Perkataan Dikuasai Serta-merta:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {masteredItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePronounceWord(item.word)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <span>{item.word.toUpperCase()}</span>
                    <Volume2 className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Needs Revision Words */}
          {supportItems.length > 0 ? (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Perkataan Perlu Ulang Kaji / Bimbingan:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {supportItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePronounceWord(item.word)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <span>{item.word.toUpperCase()}</span>
                    <Volume2 className="w-3 h-3 text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-emerald-600 font-bold bg-emerald-100/60 p-2 rounded-xl">
              🌟 Hebat! Semua perkataan dijawab dengan tepat pada percubaan pertama!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Semula Tahap Ini</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
