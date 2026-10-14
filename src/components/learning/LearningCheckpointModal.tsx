import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RefreshCw, Car } from 'lucide-react';
import { QuestionData } from '../../types/game';
import { speechEngine, sfx } from '../../utils/audio';
import { WordIllustration } from './WordIllustrations';

interface LearningCheckpointModalProps {
  question: QuestionData;
  activeLane: number;
  onAnswerSubmitted: (selectedIndex: number, isFirstAttempt: boolean, attempts: number) => void;
  onLaneChange: (laneIndex: number) => void;
  highlightSyllablesByColor?: boolean;
}

export const LearningCheckpointModal: React.FC<LearningCheckpointModalProps> = ({
  question,
  activeLane,
  onAnswerSubmitted,
  onLaneChange,
  highlightSyllablesByColor = true,
}) => {
  const [attempts, setAttempts] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpokenSegment, setActiveSpokenSegment] = useState<string | null>(null);

  // Encouraging feedback phrases in standard Bahasa Melayu
  const POSITIVE_PRAISES = [
    'Syabas! Jawapan anda sangat tepat!',
    'Bagus sekali! Pandai mengeja dan membaca!',
    'Hebat! Teruskan pemanduan laju!',
    'Tahniah! Bintang kejayaan milik anda!',
    'Cemerlang! Sebutan dan pilihan anda betul!',
  ];

  // Auto-pronounce question on appearance
  useEffect(() => {
    handlePlayAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const handlePlayAudio = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    if (question.type === 'listen') {
      // Speak the target word clearly
      await speechEngine.readSyllablesAndWord(
        question.item.syllables,
        question.item.word,
        0.75,
        (seg) => setActiveSpokenSegment(seg)
      );
    } else {
      // Pronounce syllables and full word
      await speechEngine.readSyllablesAndWord(
        question.item.syllables,
        question.item.word,
        0.8,
        (seg) => setActiveSpokenSegment(seg)
      );
    }
    setIsSpeaking(false);
    setActiveSpokenSegment(null);
  };

  const handleSelectOption = (index: number) => {
    if (isAnsweredCorrectly) return;
    setSelectedOptionIndex(index);
    onLaneChange(index);

    const chosen = question.options[index];
    const isCorrect = chosen.toUpperCase() === question.correctAnswer.toUpperCase();
    const currentAttempt = attempts + 1;
    setAttempts(currentAttempt);

    if (isCorrect) {
      setIsAnsweredCorrectly(true);
      sfx.playCorrect();

      // Confetti burst
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#38bdf8', '#facc15', '#22c55e', '#ec4899', '#a855f7'],
      });

      const randomPraise = POSITIVE_PRAISES[Math.floor(Math.random() * POSITIVE_PRAISES.length)];
      setFeedbackMessage(randomPraise);

      // Brief moment for child to absorb success, then pass checkpoint
      setTimeout(() => {
        onAnswerSubmitted(index, currentAttempt === 1, currentAttempt);
      }, 1600);
    } else {
      sfx.playWrong();
      setFeedbackMessage('Cuba lagi! Mari perhatikan suku kata dengan teliti.');
    }
  };

  // Helper to render syllables with alternate colors (standard Pemulihan Khas practice: Red & Blue)
  const renderColoredSyllables = (syllables: string[]) => {
    const colors = ['text-rose-600', 'text-sky-600', 'text-amber-600', 'text-emerald-600'];
    return syllables.map((syl, i) => (
      <span
        key={i}
        className={`inline-block font-extrabold ${highlightSyllablesByColor ? colors[i % colors.length] : 'text-slate-900'} ${
          activeSpokenSegment === syl ? 'scale-125 underline transition-transform' : ''
        }`}
      >
        {syl}
        {i < syllables.length - 1 && <span className="text-slate-400 mx-1.5 font-normal">+</span>}
      </span>
    ));
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2.5 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl max-h-[92dvh] bg-white/95 rounded-3xl shadow-2xl border-2 sm:border-4 border-sky-400 overflow-y-auto flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-slate-950 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Zon 3D
            </span>
            <span className="text-xs sm:text-sm font-bold opacity-90">{question.item.pattern}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handlePlayAudio}
              disabled={isSpeaking}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-md active:scale-95 ${
                isSpeaking ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Dengar sebutan suku kata"
            >
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{isSpeaking ? 'Membaca...' : 'Dengar Sebutan'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-6 flex flex-col items-center text-center">
          {/* Prompt Instruction */}
          <h2 className="text-sm sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">{question.prompt}</h2>

          {/* Core Visual / Question Expression */}
          <div className="w-full py-2.5 sm:py-4 px-3 sm:px-4 bg-sky-50 rounded-2xl border-2 border-sky-200 mb-3 sm:mb-5 flex flex-col items-center justify-center min-h-[80px] sm:min-h-[120px]">
            {question.type === 'picture' ? (
              <div className="flex flex-col items-center">
                <WordIllustration name={question.item.illustrationKey || question.item.word} className="w-20 h-20 sm:w-32 sm:h-32" />
                <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1 italic">{question.item.meaningOrPictureDescription}</p>
              </div>
            ) : question.type === 'blend' ? (
              <div className="text-2xl sm:text-4xl font-extrabold tracking-wider">
                {renderColoredSyllables(question.item.syllables)}
                <span className="text-slate-400 ml-2 font-light">= ?</span>
              </div>
            ) : question.type === 'parts' ? (
              <div className="text-2xl sm:text-4xl font-extrabold text-indigo-700 tracking-wider">
                {question.displayExpression}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handlePlayAudio}
                  className="p-3 sm:p-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2.5 sm:gap-3 font-black text-sm sm:text-lg"
                >
                  <Volume2 className="w-5 h-5 sm:w-7 sm:h-7 animate-bounce" />
                  <span>Dengar Semula Perkataan</span>
                </button>
                <p className="text-[11px] sm:text-xs text-slate-500">Pilih perkataan yang anda dengar.</p>
              </div>
            )}

            {/* Currently highlighted segment during audio */}
            {activeSpokenSegment && (
              <div className="mt-1.5 text-[11px] sm:text-xs font-bold text-sky-700 bg-white px-3 py-1 rounded-full shadow-sm border border-sky-200 animate-pulse">
                Sedang berbunyi: &ldquo;{activeSpokenSegment}&rdquo;
              </div>
            )}
          </div>

          {/* Feedback Banner */}
          {feedbackMessage && (
            <div
              className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm mb-3 sm:mb-4 flex items-center justify-center gap-2 animate-bounce ${
                isAnsweredCorrectly ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isAnsweredCorrectly ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> : <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />}
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* 3 Answer Lanes / Options */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCarLane = activeLane === idx;

              let btnStyle =
                'bg-white border-2 border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-800';

              if (isSelected && isAnsweredCorrectly) {
                btnStyle = 'bg-emerald-500 text-white border-3 sm:border-4 border-emerald-600 shadow-lg scale-102';
              } else if (isSelected && !isAnsweredCorrectly) {
                btnStyle = 'bg-rose-100 text-rose-700 border-2 border-rose-400';
              } else if (isCarLane) {
                btnStyle = 'bg-sky-100 border-2 border-sky-500 text-sky-900';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnsweredCorrectly}
                  className={`relative p-2.5 sm:p-3.5 rounded-2xl font-black transition-all duration-200 flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 min-h-[52px] sm:min-h-[64px] ${btnStyle}`}
                >
                  {/* Lane Badge */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    <Car className="w-3 h-3" />
                    <span>LORONG {idx + 1} ({String.fromCharCode(65 + idx)})</span>
                  </div>

                  {/* Word Option text */}
                  <span className="text-xl sm:text-2xl font-extrabold tracking-wide">{option}</span>

                  {/* Keyboard shortcut hint */}
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">
                    Pilih Lorong {idx + 1}
                  </span>

                  {/* Steering indicator */}
                  {isCarLane && !isAnsweredCorrectly && (
                    <span className="absolute -top-2 right-2 bg-sky-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow">
                      Kereta Di Sini
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Safe reminder */}
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Tiada had masa terdesak. Baca suku kata dengan tenang dan tepat!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
