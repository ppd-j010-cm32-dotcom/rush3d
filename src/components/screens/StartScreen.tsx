import React, { useState } from 'react';
import { Play, Sparkles, Volume2, ShieldCheck, Car, Award, Settings, Check } from 'lucide-react';
import { ReadingLevelId } from '../../types/game';
import { LEVEL_METADATA } from '../../data/wordBank';
import { speechEngine, sfx } from '../../utils/audio';

import { CarShowcase } from '../3d/CarShowcase';

interface StartScreenProps {
  pupilName: string;
  onUpdatePupilName: (name: string) => void;
  selectedLevel: ReadingLevelId;
  onSelectLevel: (level: ReadingLevelId) => void;
  carColor: string;
  onSelectCarColor: (color: string) => void;
  onStartGame: () => void;
  onOpenTeacherDashboard: () => void;
}

const CAR_COLORS = [
  { hex: '#0284c7', label: 'Biru Samudera Metalik' },
  { hex: '#ea580c', label: 'Jingga Emas Metalik' },
  { hex: '#dc2626', label: 'Merah Delima Berkilat' },
  { hex: '#10b981', label: 'Hijau Zamrud' },
  { hex: '#64748b', label: 'Kelabu Grafit Premium' },
  { hex: '#8b5cf6', label: 'Ungu Anggun' },
];

export const StartScreen: React.FC<StartScreenProps> = ({
  pupilName,
  onUpdatePupilName,
  selectedLevel,
  onSelectLevel,
  carColor,
  onSelectCarColor,
  onStartGame,
  onOpenTeacherDashboard,
}) => {
  const [testingSpeech, setTestingSpeech] = useState(false);
  const voiceStatus = speechEngine.getVoiceStatus();

  const handleTestAudio = async () => {
    if (testingSpeech) return;
    setTestingSpeech(true);
    sfx.playCarHorn();
    await speechEngine.readSyllablesAndWord(['se', 'la', 'mat'], 'selamat datang');
    setTestingSpeech(false);
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-sky-400 via-sky-200 to-indigo-100 flex flex-col items-center justify-start gap-3 sm:gap-6 p-2.5 sm:p-6 pt-safe pb-safe pl-safe pr-safe overflow-y-auto select-none">
      {/* Top Bar with Teacher Mode button */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-2.5 sm:mb-4 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full shadow-sm border border-sky-200">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          <span className="text-[10px] sm:text-xs font-bold text-slate-700">Intervensi Pemulihan Khas</span>
        </div>

        <button
          onClick={onOpenTeacherDashboard}
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-[11px] sm:text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
          <span>Mod Guru</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 sm:border-4 border-white p-3.5 sm:p-8 flex flex-col items-center text-center">
        {/* Game Title */}
        <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase mb-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Permainan Membaca 3D Kanak-Kanak</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-1 font-['Fredoka',sans-serif]">
          MISI BACA <span className="text-sky-600">RUSH 3D</span>
        </h1>
        <p className="text-xs sm:text-base font-bold text-slate-600 mb-2.5 sm:mb-4 tracking-wide">
          Pandu • Baca • Pilih • Kuasai
        </p>

        {/* 3D Real-time Car Showcase */}
        <div className="w-full max-w-xl bg-gradient-to-b from-slate-900/5 to-slate-900/10 rounded-2xl border border-sky-200/60 mb-3 sm:mb-4 overflow-hidden">
          <CarShowcase color={carColor} />
        </div>

        {/* Pupil Nickname Input & Car Customization */}
        <div className="w-full max-w-xl bg-sky-50 rounded-2xl p-3 sm:p-4 border-2 border-sky-200 mb-3 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
          <div className="w-full sm:w-1/2 text-left">
            <label className="block text-[11px] sm:text-xs font-black text-slate-700 uppercase mb-1">Nama Murid:</label>
            <input
              type="text"
              value={pupilName}
              onChange={(e) => onUpdatePupilName(e.target.value)}
              placeholder="Contoh: Ahmad / Siti"
              className="w-full px-3 py-1.5 sm:py-2 bg-white rounded-xl border border-sky-300 font-bold text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div className="w-full sm:w-1/2 text-left">
            <label className="block text-[11px] sm:text-xs font-black text-slate-700 uppercase mb-1">Warna Kereta:</label>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {CAR_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => onSelectCarColor(c.hex)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform shadow-sm flex items-center justify-center ${
                    carColor === c.hex ? 'scale-120 border-slate-900 ring-2 ring-sky-400' : 'border-white hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                >
                  {carColor === c.hex && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5 Educational Levels Selector */}
        <div className="w-full mb-3 sm:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
            <span className="text-[11px] sm:text-xs font-black uppercase text-slate-600">Pilih Tahap Kemahiran:</span>
            <span className="text-[10px] sm:text-xs text-sky-700 font-bold">5 Corak Silibus</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {([1, 2, 3, 4, 5] as ReadingLevelId[]).map((lvl) => {
              const meta = LEVEL_METADATA[lvl];
              const isSelected = selectedLevel === lvl;

              return (
                <button
                  key={lvl}
                  onClick={() => onSelectLevel(lvl)}
                  className={`p-3 sm:p-3.5 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between shadow-sm active:scale-95 ${
                    lvl === 5 ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-600 ring-4 ring-sky-200 scale-102 shadow-lg'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div>
                    <span
                      className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase mb-1.5 ${
                        isSelected ? 'bg-white text-sky-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Tahap {lvl}
                    </span>
                    <h3 className="font-black text-sm sm:text-base leading-snug">{meta.patternDisplay}</h3>
                  </div>

                  <div className="mt-3">
                    <p className={`text-[11px] leading-tight ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                      {meta.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {meta.examples.slice(0, 2).map((ex) => (
                        <span
                          key={ex}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Verification / Speech Info */}
        <div className="w-full max-w-xl bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-6 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sky-600" />
            <div>
              <p className="text-xs font-bold text-slate-800">
                Sistem Sebutan Bahasa Melayu: {voiceStatus.isMalay ? '✅ Bahasa Melayu Dikesan' : 'Aktif (Sintesis Pertuturan)'}
              </p>
              <p className="text-[11px] text-slate-500">Membaca suku kata satu demi satu secara jelas.</p>
            </div>
          </div>

          <button
            onClick={handleTestAudio}
            disabled={testingSpeech}
            className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            {testingSpeech ? 'Menguji...' : 'Uji Bunyi'}
          </button>
        </div>

        {/* Start Driving Action Button */}
        <button
          onClick={onStartGame}
          className="w-full max-w-md py-4 sm:py-5 px-8 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:brightness-105 active:scale-98 text-white rounded-3xl font-black text-xl sm:text-2xl shadow-xl border-b-6 border-emerald-700 flex items-center justify-center gap-3 transition-all cursor-pointer"
        >
          <Play className="w-7 h-7 fill-white" />
          <span>MULA MEMANDU & BACA</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl text-center text-xs text-sky-900/80 font-bold mt-4 flex items-center justify-center gap-4">
        <span>© Misi Baca Rush 3D</span>
        <span>•</span>
        <span>Kementerian Pendidikan Malaysia (Inisiatif Pemulihan Khas)</span>
      </div>
    </div>
  );
};
