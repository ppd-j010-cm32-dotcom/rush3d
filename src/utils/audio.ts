/**
 * Audio synthesis & Speech helper for Malay reading intervention
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Gentle non-punishing encouragement tone (two soft notes)
    const notes = [392.0, 329.63]; // G4, E4
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.15 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.3);
    });
  }

  public playGatePass() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playCarHorn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [440, 554.37].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  public playCelebrationFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.25 },
      { f: 783.99, d: 0.3 },
      { f: 1046.5, d: 0.5 },
    ];
    let offset = 0;
    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + offset);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + offset);
      osc.stop(now + offset + note.d + 0.05);
      offset += note.d + 0.03;
    });
  }
}

export const sfx = new SoundEffects();

/**
 * Speech synthesis controller with syllable-by-syllable & whole-word reading
 */
class MalaySpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private malayVoice: SpeechSynthesisVoice | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize Malay (ms, ms-MY), then Indonesian (id, id-ID), then default
    this.malayVoice =
      voices.find((v) => v.lang.startsWith('ms') || v.lang.includes('MY')) ||
      voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;
  }

  public getVoiceStatus(): { available: boolean; isMalay: boolean; voiceName: string } {
    if (!this.synth) return { available: false, isMalay: false, voiceName: 'Tiada sokongan' };
    const voice = this.malayVoice;
    const isMalay = !!voice && (voice.lang.startsWith('ms') || voice.lang.startsWith('id'));
    return {
      available: true,
      isMalay,
      voiceName: voice ? `${voice.name} (${voice.lang})` : 'Suara Lalai',
    };
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Speaks a single utterance
   */
  public speakText(text: string, rate: number = 0.85, pitch: number = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }
      this.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.malayVoice) utterance.voice = this.malayVoice;
      utterance.lang = this.malayVoice?.lang || 'ms-MY';
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      this.isSpeaking = true;
      this.synth.speak(utterance);
    });
  }

  /**
   * Reads syllables one by one with pauses, followed by the complete word.
   * Special instruction requirement:
   * "For every reading item:
   *  - Read individual syllables.
   *  - Pause briefly.
   *  - Read the complete word.
   *  - Allow pupils to repeat playback.
   *  Example: 'bu', 'ku', 'buku'"
   */
  public async readSyllablesAndWord(
    syllables: string[],
    fullWord: string,
    rate: number = 0.8,
    onProgress?: (currentSegment: string | null) => void
  ): Promise<void> {
    if (!this.synth) return;
    this.cancel();

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    try {
      // Step 1: Read each syllable
      for (const syl of syllables) {
        if (onProgress) onProgress(syl);
        await this.speakText(syl, rate, 1.05);
        await sleep(350);
      }

      // Brief pause before whole word
      if (onProgress) onProgress(null);
      await sleep(250);

      // Step 2: Read whole word
      if (onProgress) onProgress(fullWord);
      await this.speakText(fullWord, Math.min(rate + 0.1, 1.0), 1.0);
      await sleep(200);
      if (onProgress) onProgress(null);
    } catch {
      if (onProgress) onProgress(null);
    }
  }
}

export const speechEngine = new MalaySpeechEngine();
