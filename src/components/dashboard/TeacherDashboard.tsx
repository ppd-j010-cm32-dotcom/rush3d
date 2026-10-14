import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  BookOpen,
  Settings,
  History,
  TrendingUp,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
} from 'lucide-react';
import { WordItem, ReadingLevelId, TeacherSettings, QuestionType } from '../../types/game';
import { LEVEL_METADATA, validateWordItem } from '../../data/wordBank';
import {
  getAllWordItems,
  saveCustomWord,
  deleteCustomWord,
  getSessionHistory,
  getMasteryRecords,
  getTeacherSettings,
  saveTeacherSettings,
} from '../../utils/storage';
import { speechEngine } from '../../utils/audio';

interface TeacherDashboardProps {
  onClose: () => void;
  onRefreshWords: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onClose, onRefreshWords }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'words' | 'settings'>('analytics');
  const [settings, setSettings] = useState<TeacherSettings>(getTeacherSettings());
  const [words, setWords] = useState<WordItem[]>(getAllWordItems());
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<ReadingLevelId | 'all'>('all');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true); // Easy access with PIN confirmation
  const [pinInput, setPinInput] = useState<string>('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // New Word form state
  const [newWord, setNewWord] = useState<string>('');
  const [newSyllables, setNewSyllables] = useState<string>('');
  const [newLevel, setNewLevel] = useState<ReadingLevelId>(1);
  const [newMeaning, setNewMeaning] = useState<string>('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const sessionHistory = getSessionHistory();
  const masteryRecords = getMasteryRecords();

  const handleSaveSettings = () => {
    saveTeacherSettings(settings);
    setSaveSuccessNotice('Tetapan guru berjaya disimpan!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWord = newWord.trim().toLowerCase();
    const cleanSyllables = newSyllables
      .split(/[,+\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const patternMap: Record<ReadingLevelId, WordItem['pattern']> = {
      1: 'KV+KV',
      2: 'KVKV+KV',
      3: 'KV+KVK',
      4: 'KVK+KV',
      5: 'KVK+KVK+KVK',
    };

    const newItem: WordItem = {
      id: `custom_${Date.now()}`,
      level: newLevel,
      pattern: patternMap[newLevel],
      word: cleanWord,
      syllables: cleanSyllables,
      displayGrouping: cleanSyllables.join(' + '),
      meaningOrPictureDescription: newMeaning.trim() || `Perkataan ${cleanWord}`,
      audioText: cleanWord,
      questionTypes: ['blend', 'parts', 'listen'] as QuestionType[],
      isCustom: true,
    };

    const validation = validateWordItem(newItem);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    saveCustomWord(newItem);
    setWords(getAllWordItems());
    onRefreshWords();
    setNewWord('');
    setNewSyllables('');
    setNewMeaning('');
    setFormErrors([]);
    setSaveSuccessNotice(`Perkataan "${cleanWord}" berjaya ditambah!`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleDeleteWord = (id: string) => {
    if (confirm('Adakah anda pasti mahu memadam perkataan ini?')) {
      deleteCustomWord(id);
      setWords(getAllWordItems());
      onRefreshWords();
    }
  };

  const handleTestAudio = (text: string) => {
    speechEngine.speakText(text, settings.speechRate, settings.speechPitch);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredWords =
    selectedLevelFilter === 'all' ? words : words.filter((w) => w.level === selectedLevelFilter);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-start p-1.5 sm:p-6 pt-safe pb-safe pl-safe pr-safe overflow-y-auto select-none print:p-0 print:bg-white">
      <div className="w-full max-w-5xl max-h-[96dvh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:w-full print:max-h-none">
        {/* Top Navbar */}
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-2.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 print:hidden">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
              title="Kembali ke Permainan"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-lg font-black tracking-tight">Papan Pemuka Guru & Terapi</h2>
              <p className="text-[9px] sm:text-xs text-sky-400 font-bold">Misi Baca Rush 3D (Pemulihan Khas)</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-2xl overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center justify-center flex-1 sm:flex-initial gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'analytics' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Analisis Murid</span>
            </button>
            <button
              onClick={() => setActiveTab('words')}
              className={`flex items-center justify-center flex-1 sm:flex-initial gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'words' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bank Perkataan</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center justify-center flex-1 sm:flex-initial gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Tetapan</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessNotice && (
          <div className="bg-emerald-500 text-white px-6 py-2 text-xs font-bold flex items-center justify-center gap-2 print:hidden">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh] print:max-h-none print:overflow-visible">
          {/* ================= TAB 1: ANALYTICS ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Header with Print button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Laporan Perkembangan & Penguasaan Bacaan</h3>
                  <p className="text-xs text-slate-500">
                    Memantau ketepatan percubaan pertama, kekerapan bantuan dan perkataan berulang.
                  </p>
                </div>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl text-xs font-bold shadow-sm transition-all print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Eksport PDF</span>
                </button>
              </div>

              {/* Printable Header Details (Visible when printing) */}
              <div className="hidden print:block mb-4 p-4 border border-slate-300 rounded-xl">
                <h2 className="text-2xl font-bold">KEMENTERIAN PENDIDIKAN MALAYSIA</h2>
                <h3 className="text-lg font-semibold">REKOD INTERVENSI PEMULIHAN KHAS (BAHASA MELAYU)</h3>
                <p className="text-xs text-slate-600">Tarikh Cetakan: {new Date().toLocaleDateString('ms-MY')}</p>
              </div>

              {/* Aggregate Mastery Summary Table */}
              <div>
                <h4 className="text-sm font-black uppercase text-slate-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ringkasan Penguasaan Mengikut Murid & Tahap:</span>
                </h4>

                {Object.keys(masteryRecords).length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-sm text-slate-500 font-bold">Belum ada sesi pembelajaran direkodkan.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Minta murid memulakan pemanduan untuk mengumpul data bacaan.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs min-w-[620px]">
                      <thead className="bg-slate-100 text-slate-700 font-black uppercase">
                        <tr>
                          <th className="p-3">Nama Murid</th>
                          <th className="p-3">Tahap</th>
                          <th className="p-3">Sesi</th>
                          <th className="p-3">Soalan</th>
                          <th className="p-3">Ketepatan Pertama</th>
                          <th className="p-3">Kata Sering Bantuan</th>
                          <th className="p-3">Tarikh Akhir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {Object.values(masteryRecords).map((rec, i) => {
                          const accuracy =
                            rec.totalQuestionsAttempted > 0
                              ? Math.round((rec.totalFirstAttemptCorrect / rec.totalQuestionsAttempted) * 100)
                              : 0;

                          const troubledList = Object.entries(rec.troubledWords)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3);

                          return (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-3 font-extrabold">{rec.pupilName}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">
                                  Tahap {rec.level} ({LEVEL_METADATA[rec.level].patternDisplay})
                                </span>
                              </td>
                              <td className="p-3 font-bold">{rec.sessionsCompleted}</td>
                              <td className="p-3 font-bold">{rec.totalQuestionsAttempted}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                                    accuracy >= settings.masteryAccuracyThresholdPercent
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {accuracy}% {accuracy >= settings.masteryAccuracyThresholdPercent ? '✓ Kuasai' : '⚠️ Perlu Bimbingan'}
                                </span>
                              </td>
                              <td className="p-3">
                                {troubledList.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {troubledList.map(([w, cnt]) => (
                                      <span key={w} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold rounded text-[10px]">
                                        {w.toUpperCase()} ({cnt}x)
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-emerald-600 font-bold text-[10px]">Tiada kekeliruan</span>
                                )}
                              </td>
                              <td className="p-3 text-slate-500">{rec.lastSessionDate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Sessions History */}
              <div>
                <h4 className="text-sm font-black uppercase text-slate-700 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-sky-600" />
                  <span>Log Sesi Pembelajaran Terbaharu (5 Terkini):</span>
                </h4>

                <div className="space-y-2">
                  {sessionHistory.slice(0, 5).map((s) => {
                    const acc = Math.round((s.firstAttemptCorrectCount / s.totalQuestions) * 100);
                    return (
                      <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-900">{s.pupilName}</span>
                          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold">
                            Tahap {s.level}
                          </span>
                          <span className="text-slate-500">
                            {new Date(s.timestamp).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-bold">
                          <span className="text-amber-600">⭐ {s.stars} Bintang</span>
                          <span className="text-sky-600">{s.totalScore} Mata</span>
                          <span className={acc >= 80 ? 'text-emerald-600' : 'text-amber-600'}>
                            Ketepatan: {acc}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: WORDS BANK ================= */}
          {activeTab === 'words' && (
            <div className="space-y-6">
              {/* Header and Level filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Pengurusan Bank Perkataan Pemulihan</h3>
                  <p className="text-xs text-slate-500">
                    Guru boleh menambah kosa kata mengikut keperluan individu murid atau tema pengajaran harian.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600">Tapis:</span>
                  {(['all', 1, 2, 3, 4, 5] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevelFilter(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedLevelFilter === lvl ? 'bg-sky-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {lvl === 'all' ? 'Semua' : `T${lvl}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add New Word Form */}
              <form onSubmit={handleAddWord} className="bg-sky-50 rounded-2xl p-4 border border-sky-200 space-y-3">
                <h4 className="text-xs font-black uppercase text-sky-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>Tambah Perkataan Baharu:</span>
                </h4>

                {formErrors.length > 0 && (
                  <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold space-y-1">
                    {formErrors.map((err, i) => (
                      <p key={i}>• {err}</p>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Tahap Silibus:</label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(Number(e.target.value) as ReadingLevelId)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value={1}>Tahap 1: KV+KV</option>
                      <option value={2}>Tahap 2: KVKV+KV (3 Suku Kata KV)</option>
                      <option value={3}>Tahap 3: KV+KVK</option>
                      <option value={4}>Tahap 4: KVK+KV</option>
                      <option value={5}>Tahap 5: KVK+KVK+KVK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Perkataan Penuh:</label>
                    <input
                      type="text"
                      placeholder="Contoh: topi"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pecahan Suku Kata:</label>
                    <input
                      type="text"
                      placeholder="to, pi (asingkan koma/tambah)"
                      value={newSyllables}
                      onChange={(e) => setNewSyllables(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Penerangan / Maksud:</label>
                    <input
                      type="text"
                      placeholder="Topi melindungi kepala"
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan ke Bank Perkataan</span>
                  </button>
                </div>
              </form>

              {/* Words Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead className="bg-slate-100 text-slate-700 font-black uppercase">
                    <tr>
                      <th className="p-3">Perkataan</th>
                      <th className="p-3">Tahap & Corak</th>
                      <th className="p-3">Suku Kata</th>
                      <th className="p-3">Sebutan Audio</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredWords.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-black text-sm">{item.word.toUpperCase()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                            Tahap {item.level} ({item.pattern})
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-indigo-700">{item.syllables.join(' + ')}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleTestAudio(item.word)}
                            className="p-1.5 bg-slate-100 hover:bg-sky-100 text-sky-700 rounded-lg transition-all"
                            title="Dengar sebutan"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3">
                          {item.isCustom ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                              Kustom Guru
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold text-[10px]">
                              Silibus Asas
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {item.isCustom && (
                            <button
                              onClick={() => handleDeleteWord(item.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                              title="Padam"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-xl font-black text-slate-900">Konfigurasi Intervensi & Audio</h3>
                <p className="text-xs text-slate-500">
                  Ubah suai parameter pengajaran agar berpadanan dengan tahap kesediaan murid.
                </p>
              </div>

              <div className="space-y-4">
                {/* Mastery Threshold */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-slate-800 uppercase">
                      Penanda Aras Penguasaan (Mastery Threshold):
                    </label>
                    <span className="text-sm font-black text-sky-600">{settings.masteryAccuracyThresholdPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={settings.masteryAccuracyThresholdPercent}
                    onChange={(e) =>
                      setSettings({ ...settings, masteryAccuracyThresholdPercent: Number(e.target.value) })
                    }
                    className="w-full accent-sky-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Standard amali pemulihan mencadangkan sekurang-kurangnya 80% ketepatan percubaan pertama.
                  </p>
                </div>

                {/* Questions per Session */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-slate-800 uppercase">
                      Bilangan Soalan Setiap Sesi Pemanduan:
                    </label>
                    <span className="text-sm font-black text-sky-600">{settings.questionsPerSession} Soalan</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="15"
                    step="1"
                    value={settings.questionsPerSession}
                    onChange={(e) => setSettings({ ...settings, questionsPerSession: Number(e.target.value) })}
                    className="w-full accent-sky-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cadangan 6-8 soalan untuk mengelakkan keletihan kognitif murid pemulihan.
                  </p>
                </div>

                {/* Speech rate */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-slate-800 uppercase">
                      Kelajuan Sebutan Suara (Speech Rate):
                    </label>
                    <span className="text-sm font-black text-sky-600">{settings.speechRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.0"
                    step="0.05"
                    value={settings.speechRate}
                    onChange={(e) => setSettings({ ...settings, speechRate: Number(e.target.value) })}
                    className="w-full accent-sky-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Kelajuan lebih perlahan (0.75x - 0.85x) membantu murid mendengar fonem dengan jelas.
                  </p>
                </div>

                {/* Syllable Color Highlight Toggle */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-black text-slate-800 uppercase block">
                      Pewarnaan Suku Kata Berbeza (Merah & Biru):
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Standard pedagogi Linus/Pemulihan Khas untuk memudahkan pemisahan visual suku kata.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.highlightSyllablesByColor}
                    onChange={(e) => setSettings({ ...settings, highlightSyllablesByColor: e.target.checked })}
                    className="w-5 h-5 accent-sky-600 rounded"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    onClick={handleSaveSettings}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Semua Tetapan Guru</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
