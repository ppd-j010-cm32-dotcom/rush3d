import { WordItem, ReadingLevelId, QuestionData, QuestionType } from '../types/game';

export const DEFAULT_WORD_BANK: WordItem[] = [
  // ===================== TAHAP 1: KV + KV =====================
  {
    id: 'L1_001',
    level: 1,
    pattern: 'KV+KV',
    word: 'buku',
    syllables: ['bu', 'ku'],
    displayGrouping: 'bu + ku',
    meaningOrPictureDescription: 'Sebuah buku bacaan cerita bergambar',
    audioText: 'buku',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'buku',
  },
  {
    id: 'L1_002',
    level: 1,
    pattern: 'KV+KV',
    word: 'bola',
    syllables: ['bo', 'la'],
    displayGrouping: 'bo + la',
    meaningOrPictureDescription: 'Sebiji bola sepak bulat warna-warni',
    audioText: 'bola',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'bola',
  },
  {
    id: 'L1_003',
    level: 1,
    pattern: 'KV+KV',
    word: 'mata',
    syllables: ['ma', 'ta'],
    displayGrouping: 'ma + ta',
    meaningOrPictureDescription: 'Sepasang mata comel untuk melihat',
    audioText: 'mata',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'mata',
  },
  {
    id: 'L1_004',
    level: 1,
    pattern: 'KV+KV',
    word: 'baju',
    syllables: ['ba', 'ju'],
    displayGrouping: 'ba + ju',
    meaningOrPictureDescription: 'Baju kemeja kemas berbutang',
    audioText: 'baju',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'baju',
  },
  {
    id: 'L1_005',
    level: 1,
    pattern: 'KV+KV',
    word: 'kaki',
    syllables: ['ka', 'ki'],
    displayGrouping: 'ka + ki',
    meaningOrPictureDescription: 'Kaki sihat berjalan laju',
    audioText: 'kaki',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kaki',
  },
  {
    id: 'L1_006',
    level: 1,
    pattern: 'KV+KV',
    word: 'susu',
    syllables: ['su', 'su'],
    displayGrouping: 'su + su',
    meaningOrPictureDescription: 'Sekotak susu segar berkhasiat',
    audioText: 'susu',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'susu',
  },
  {
    id: 'L1_007',
    level: 1,
    pattern: 'KV+KV',
    word: 'topi',
    syllables: ['to', 'pi'],
    displayGrouping: 'to + pi',
    meaningOrPictureDescription: 'Topi pelindung panas matahari',
    audioText: 'topi',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'topi',
  },
  {
    id: 'L1_008',
    level: 1,
    pattern: 'KV+KV',
    word: 'roti',
    syllables: ['ro', 'ti'],
    displayGrouping: 'ro + ti',
    meaningOrPictureDescription: 'Buku roti bakar enak',
    audioText: 'roti',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'roti',
  },
  {
    id: 'L1_009',
    level: 1,
    pattern: 'KV+KV',
    word: 'lori',
    syllables: ['lo', 'ri'],
    displayGrouping: 'lo + ri',
    meaningOrPictureDescription: 'Sebuah lori pengangkut barang',
    audioText: 'lori',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'lori',
  },

  // ===================== TAHAP 2: KVKV + KV =====================
  {
    id: 'L2_001',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'kereta',
    syllables: ['ke', 're', 'ta'],
    displayGrouping: 'kere + ta',
    meaningOrPictureDescription: 'Sebuah kereta sedan merah',
    audioText: 'kereta',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kereta',
  },
  {
    id: 'L2_002',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'kelapa',
    syllables: ['ke', 'la', 'pa'],
    displayGrouping: 'kela + pa',
    meaningOrPictureDescription: 'Buah kelapa muda hijau',
    audioText: 'kelapa',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kelapa',
  },
  {
    id: 'L2_003',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'kamera',
    syllables: ['ka', 'me', 'ra'],
    displayGrouping: 'kame + ra',
    meaningOrPictureDescription: 'Kamera digital merakam gambar',
    audioText: 'kamera',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kamera',
  },
  {
    id: 'L2_004',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'menari',
    syllables: ['me', 'na', 'ri'],
    displayGrouping: 'mena + ri',
    meaningOrPictureDescription: 'Murid sedang riang menari',
    audioText: 'menari',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'menari',
  },
  {
    id: 'L2_005',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'selesa',
    syllables: ['se', 'le', 'sa'],
    displayGrouping: 'sele + sa',
    meaningOrPictureDescription: 'Kerusi empuk yang sangat selesa',
    audioText: 'selesa',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'selesa',
  },
  {
    id: 'L2_006',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'pelita',
    syllables: ['pe', 'li', 'ta'],
    displayGrouping: 'peli + ta',
    meaningOrPictureDescription: 'Pelita minyak tanah bercahaya',
    audioText: 'pelita',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'pelita',
  },
  {
    id: 'L2_007',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'tomato',
    syllables: ['to', 'ma', 'to'],
    displayGrouping: 'toma + to',
    meaningOrPictureDescription: 'Buah tomato merah segar',
    audioText: 'tomato',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'tomato',
  },
  {
    id: 'L2_008',
    level: 2,
    pattern: 'KVKV+KV',
    word: 'keladi',
    syllables: ['ke', 'la', 'di'],
    displayGrouping: 'kela + di',
    meaningOrPictureDescription: 'Pokok ubi keladi berdaun lebar',
    audioText: 'keladi',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'keladi',
  },

  // ===================== TAHAP 3: KV + KVK =====================
  {
    id: 'L3_001',
    level: 3,
    pattern: 'KV+KVK',
    word: 'kasut',
    syllables: ['ka', 'sut'],
    displayGrouping: 'ka + sut',
    meaningOrPictureDescription: 'Sepasang kasut sukan biru',
    audioText: 'kasut',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kasut',
  },
  {
    id: 'L3_002',
    level: 3,
    pattern: 'KV+KVK',
    word: 'sabun',
    syllables: ['sa', 'bun'],
    displayGrouping: 'sa + bun',
    meaningOrPictureDescription: 'Sebuku sabun wangi berbuih',
    audioText: 'sabun',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'sabun',
  },
  {
    id: 'L3_003',
    level: 3,
    pattern: 'KV+KVK',
    word: 'mulut',
    syllables: ['mu', 'lut'],
    displayGrouping: 'mu + lut',
    meaningOrPictureDescription: 'Mulut ceria tersenyum lebar',
    audioText: 'mulut',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'mulut',
  },
  {
    id: 'L3_004',
    level: 3,
    pattern: 'KV+KVK',
    word: 'batuk',
    syllables: ['ba', 'tuk'],
    displayGrouping: 'ba + tuk',
    meaningOrPictureDescription: 'Menutup mulut ketika batuk',
    audioText: 'batuk',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'batuk',
  },
  {
    id: 'L3_005',
    level: 3,
    pattern: 'KV+KVK',
    word: 'katak',
    syllables: ['ka', 'tak'],
    displayGrouping: 'ka + tak',
    meaningOrPictureDescription: 'Seekor katak hijau melompat',
    audioText: 'katak',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'katak',
  },
  {
    id: 'L3_006',
    level: 3,
    pattern: 'KV+KVK',
    word: 'kipas',
    syllables: ['ki', 'pas'],
    displayGrouping: 'ki + pas',
    meaningOrPictureDescription: 'Kipas angin berputar sejuk',
    audioText: 'kipas',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kipas',
  },
  {
    id: 'L3_007',
    level: 3,
    pattern: 'KV+KVK',
    word: 'cawan',
    syllables: ['ca', 'wan'],
    displayGrouping: 'ca + wan',
    meaningOrPictureDescription: 'Secawan teh suam berwap',
    audioText: 'cawan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'cawan',
  },
  {
    id: 'L3_008',
    level: 3,
    pattern: 'KV+KVK',
    word: 'jarum',
    syllables: ['ja', 'rum'],
    displayGrouping: 'ja + rum',
    meaningOrPictureDescription: 'Sebatang jarum jahit dan benang',
    audioText: 'jarum',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'jarum',
  },

  // ===================== TAHAP 4: KVK + KV =====================
  {
    id: 'L4_001',
    level: 4,
    pattern: 'KVK+KV',
    word: 'lampu',
    syllables: ['lam', 'pu'],
    displayGrouping: 'lam + pu',
    meaningOrPictureDescription: 'Sebiji lampu meja bercahaya terang',
    audioText: 'lampu',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'lampu',
  },
  {
    id: 'L4_002',
    level: 4,
    pattern: 'KVK+KV',
    word: 'pintu',
    syllables: ['pin', 'tu'],
    displayGrouping: 'pin + tu',
    meaningOrPictureDescription: 'Pintu bilik darjah terbuka',
    audioText: 'pintu',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'pintu',
  },
  {
    id: 'L4_003',
    level: 4,
    pattern: 'KVK+KV',
    word: 'bantu',
    syllables: ['ban', 'tu'],
    displayGrouping: 'ban + tu',
    meaningOrPictureDescription: 'Sikap saling bantu membantu rakan',
    audioText: 'bantu',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'bantu',
  },
  {
    id: 'L4_004',
    level: 4,
    pattern: 'KVK+KV',
    word: 'tandu',
    syllables: ['tan', 'du'],
    displayGrouping: 'tan + du',
    meaningOrPictureDescription: 'Tandu pengusung pesakit kecemasan',
    audioText: 'tandu',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'tandu',
  },
  {
    id: 'L4_005',
    level: 4,
    pattern: 'KVK+KV',
    word: 'sendi',
    syllables: ['sen', 'di'],
    displayGrouping: 'sen + di',
    meaningOrPictureDescription: 'Sendi siku dan lutut manusia',
    audioText: 'sendi',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'sendi',
  },
  {
    id: 'L4_006',
    level: 4,
    pattern: 'KVK+KV',
    word: 'kendi',
    syllables: ['ken', 'di'],
    displayGrouping: 'ken + di',
    meaningOrPictureDescription: 'Kendi air tembikar tradisional',
    audioText: 'kendi',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kendi',
  },
  {
    id: 'L4_007',
    level: 4,
    pattern: 'KVK+KV',
    word: 'bomba',
    syllables: ['bom', 'ba'],
    displayGrouping: 'bom + ba',
    meaningOrPictureDescription: 'Pasukan ahli bomba berani',
    audioText: 'bomba',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'bomba',
  },
  {
    id: 'L4_008',
    level: 4,
    pattern: 'KVK+KV',
    word: 'lembu',
    syllables: ['lem', 'bu'],
    displayGrouping: 'lem + bu',
    meaningOrPictureDescription: 'Seekor lembu sihat makan rumput',
    audioText: 'lembu',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'lembu',
  },
  {
    id: 'L4_009',
    level: 4,
    pattern: 'KVK+KV',
    word: 'garpu',
    syllables: ['gar', 'pu'],
    displayGrouping: 'gar + pu',
    meaningOrPictureDescription: 'Garpu makan berkilat empat mata',
    audioText: 'garpu',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'garpu',
  },

  // ===================== TAHAP 5: KVK + KVK + KVK =====================
  {
    id: 'L5_001',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'cantumkan',
    syllables: ['can', 'tum', 'kan'],
    displayGrouping: 'can + tum + kan',
    meaningOrPictureDescription: 'Mencantumkan kepingan puzzle bergambar',
    audioText: 'cantumkan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'cantumkan',
  },
  {
    id: 'L5_002',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'mantapkan',
    syllables: ['man', 'tap', 'kan'],
    displayGrouping: 'man + tap + kan',
    meaningOrPictureDescription: 'Memantapkan kemahiran membaca bersama cikgu',
    audioText: 'mantapkan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'mantapkan',
  },
  {
    id: 'L5_003',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'tampalkan',
    syllables: ['tam', 'pal', 'kan'],
    displayGrouping: 'tam + pal + kan',
    meaningOrPictureDescription: 'Menampalkan pelekat bintang pada buku latihan',
    audioText: 'tampalkan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'tampalkan',
  },
  {
    id: 'L5_004',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'lantunkan',
    syllables: ['lan', 'tun', 'kan'],
    displayGrouping: 'lan + tun + kan',
    meaningOrPictureDescription: 'Melantunkan bola keranjang ke lantai',
    audioText: 'lantunkan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'lantunkan',
  },
  {
    id: 'L5_005',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'simpankan',
    syllables: ['sim', 'pan', 'kan'],
    displayGrouping: 'sim + pan + kan',
    meaningOrPictureDescription: 'Menyimpankan buku dan pensel ke dalam beg sekolah',
    audioText: 'simpankan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'simpankan',
  },
  {
    id: 'L5_006',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'kumpulkan',
    syllables: ['kum', 'pul', 'kan'],
    displayGrouping: 'kum + pul + kan',
    meaningOrPictureDescription: 'Mengumpulkan lencana kejayaan pemulihan',
    audioText: 'kumpulkan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'kumpulkan',
  },
  {
    id: 'L5_007',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'bentangkan',
    syllables: ['ben', 'tang', 'kan'],
    displayGrouping: 'ben + tang + kan',
    meaningOrPictureDescription: 'Membentangkan tikar membaca di taman permainan',
    audioText: 'bentangkan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'bentangkan',
  },
  {
    id: 'L5_008',
    level: 5,
    pattern: 'KVK+KVK+KVK',
    word: 'tumpahkan',
    syllables: ['tum', 'pah', 'kan'],
    displayGrouping: 'tum + pah + kan',
    meaningOrPictureDescription: 'Menumpahkan air ke dalam corong eksperimen sains',
    audioText: 'tumpahkan',
    questionTypes: ['blend', 'parts', 'picture', 'listen'],
    illustrationKey: 'tumpahkan',
  },
];

export function getWordsByLevel(level: ReadingLevelId): WordItem[] {
  return DEFAULT_WORD_BANK.filter((item) => item.level === level);
}

export const LEVEL_METADATA: Record<
  ReadingLevelId,
  {
    title: string;
    patternDisplay: string;
    color: string;
    badgeBg: string;
    description: string;
    examples: string[];
    checkpointDist: number;
  }
> = {
  1: {
    title: 'Tahap 1: KV + KV',
    patternDisplay: 'KV + KV',
    color: '#0284c7', // Sky blue
    badgeBg: 'bg-sky-500',
    description: 'Gabungan 2 suku kata terbuka asas (contoh: bu + ku = buku).',
    examples: ['buku', 'bola', 'mata', 'baju', 'kaki', 'susu'],
    checkpointDist: 250,
  },
  2: {
    title: 'Tahap 2: KVKV + KV',
    patternDisplay: 'KVKV + KV (3 Suku Kata KV)',
    color: '#059669', // Emerald
    badgeBg: 'bg-emerald-500',
    description: 'Tiga suku kata KV dengan fokus struktur dua suku kata pertama dan akhir.',
    examples: ['kereta', 'kelapa', 'kamera', 'menari', 'selesa'],
    checkpointDist: 280,
  },
  3: {
    title: 'Tahap 3: KV + KVK',
    patternDisplay: 'KV + KVK',
    color: '#d97706', // Amber/Yellow
    badgeBg: 'bg-amber-500',
    description: 'Satu suku kata terbuka diikuti satu suku kata tertutup berakhiran konsonan.',
    examples: ['kasut', 'sabun', 'mulut', 'batuk', 'katak', 'kipas'],
    checkpointDist: 300,
  },
  4: {
    title: 'Tahap 4: KVK + KV',
    patternDisplay: 'KVK + KV',
    color: '#7c3aed', // Purple
    badgeBg: 'bg-purple-600',
    description: 'Satu suku kata tertutup bermula dahulu diikuti satu suku kata terbuka.',
    examples: ['lampu', 'pintu', 'bantu', 'tandu', 'sendi', 'bomba'],
    checkpointDist: 320,
  },
  5: {
    title: 'Tahap 5: KVK + KVK + KVK',
    patternDisplay: 'KVK + KVK + KVK',
    color: '#e11d48', // Rose / Red
    badgeBg: 'bg-rose-500',
    description: 'Tiga suku kata tertutup bermakna dengan konteks visual jelas.',
    examples: ['cantumkan', 'mantapkan', 'tampalkan', 'lantunkan', 'kumpulkan'],
    checkpointDist: 340,
  },
};

/**
 * Validates a word item against strict integrity rules
 */
export function validateWordItem(item: Partial<WordItem>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!item.id || item.id.trim() === '') errors.push('ID perkataan tidak boleh kosong.');
  if (!item.word || item.word.trim() === '') errors.push('Perkataan tidak boleh kosong.');
  if (!item.syllables || item.syllables.length < 2) errors.push('Mesti mempunyai sekurang-kurangnya 2 suku kata.');
  if (item.syllables && item.syllables.join('').toLowerCase() !== (item.word || '').toLowerCase()) {
    errors.push('Gabungan suku kata tidak sepadan dengan perkataan penuh.');
  }
  if (!item.level || item.level < 1 || item.level > 5) {
    errors.push('Tahap mestilah antara 1 hingga 5.');
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates an educational question with 3 options and exactly 1 correct answer.
 */
export function generateQuestion(
  targetItem: WordItem,
  allLevelItems: WordItem[],
  preferredType?: QuestionType
): QuestionData {
  // Choose question type available for item
  const validTypes = targetItem.questionTypes.length > 0 ? targetItem.questionTypes : ['blend', 'parts', 'listen'];
  const type: QuestionType =
    preferredType && validTypes.includes(preferredType)
      ? preferredType
      : validTypes[Math.floor(Math.random() * validTypes.length)] as QuestionType;

  // Build 2 unique distractors from the same level
  const candidates = allLevelItems.filter((i) => i.word.toLowerCase() !== targetItem.word.toLowerCase());
  const shuffledCandidates = [...candidates].sort(() => 0.5 - Math.random());
  const distractor1 = shuffledCandidates[0]?.word.toUpperCase() || 'BOLA';
  const distractor2 = shuffledCandidates[1]?.word.toUpperCase() || 'BUKU';

  const correctUpper = targetItem.word.toUpperCase();
  const rawOptions = [correctUpper, distractor1, distractor2];

  // Ensure 3 strictly unique options
  const uniqueOptions = Array.from(new Set(rawOptions));
  while (uniqueOptions.length < 3) {
    const fallbackWords = ['KASUT', 'LAMPU', 'PINTU', 'MEJA', 'SUSU', 'ROTI'];
    const extra = fallbackWords.find((w) => !uniqueOptions.includes(w)) || `KATA_${uniqueOptions.length}`;
    uniqueOptions.push(extra);
  }

  // Shuffle options to randomize lane
  const shuffledOptions = [...uniqueOptions].sort(() => 0.5 - Math.random());
  const correctIndex = shuffledOptions.indexOf(correctUpper);

  let prompt = '';
  let displayExpression = '';
  let explanation = '';

  switch (type) {
    case 'blend':
      prompt = 'Cantumkan suku kata di bawah:';
      displayExpression = `${targetItem.syllables.join(' + ')} = ?`;
      explanation = `Suku kata ${targetItem.syllables.join(' + ')} dicantumkan menjadi "${correctUpper}".`;
      break;

    case 'parts':
      prompt = 'Pilih perkataan yang terbentuk daripada suku kata ini:';
      displayExpression = targetItem.displayGrouping.toUpperCase();
      explanation = `Suku kata ${targetItem.displayGrouping.toUpperCase()} membentuk perkataan "${correctUpper}".`;
      break;

    case 'picture':
      prompt = 'Apakah nama objek atau perlakuan dalam gambar ini?';
      displayExpression = targetItem.meaningOrPictureDescription;
      explanation = `Gambar ini menunjukkan "${correctUpper}" (${targetItem.meaningOrPictureDescription}).`;
      break;

    case 'listen':
      prompt = 'Dengar sebutan dengan teliti dan pilih perkataan yang betul:';
      displayExpression = '🔊 Tekan butang untuk mendengar sebutan';
      explanation = `Sebutan perkataan tersebut ialah "${correctUpper}".`;
      break;
  }

  return {
    id: `q_${targetItem.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    item: targetItem,
    type,
    prompt,
    displayExpression,
    options: shuffledOptions,
    correctAnswer: correctUpper,
    correctIndex,
    explanation,
  };
}
