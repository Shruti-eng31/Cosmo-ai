// Native Web Audio synthesizer for Astrophysical & Cosmological phenomena
// Generates gravitational wave inspiral chirps, pulsar resonance, and interstellar hydrogen line ambient tones.
// Zero external files, fully client-side.

class CosmicSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneGain: GainNode | null = null;
  private oscArray: OscillatorNode[] = [];

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startInterstellarDrone();
    } else {
      this.stopInterstellarDrone();
    }
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Interstellar Ambient Resonance:
  // Tuned to sub-harmonics of the 21cm (1420 MHz) Hydrogen line and cosmic microwave background frequencies
  private startInterstellarDrone() {
    if (!this.ctx || this.isMuted) return;

    try {
      if (this.droneGain) {
        this.droneGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.droneGain.gain.exponentialRampToValueAtTime(0.07, this.ctx.currentTime + 2.5);
        return;
      }

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.001, this.ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.07, this.ctx.currentTime + 2.5);

      // Deep celestial frequencies: Sub-bass 55Hz (A1), 82.4Hz (E2), 110Hz (A2), 164.8Hz (E3)
      const cosmicFrequencies = [55.0, 82.41, 110.0, 164.81];
      this.oscArray = [];

      cosmicFrequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

        osc.type = idx === 0 ? "sine" : idx === 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const gainVal = 0.18 / (idx + 1);
        oscGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime((idx % 2 === 0 ? -0.35 : 0.35), this.ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(panner);
          panner.connect(master);
        } else {
          osc.connect(oscGain);
          oscGain.connect(master);
        }

        osc.start();
        this.oscArray.push(osc);
      });

      master.connect(this.ctx.destination);
      this.droneGain = master;
    } catch {
      // Audio might fail if user hasn't interacted yet
    }
  }

  private stopInterstellarDrone() {
    if (!this.ctx || !this.droneGain) return;
    try {
      this.droneGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
    } catch {
      // Ignore
    }
  }

  // Gravitational Wave Inspiral Chirp / Supernova Pulse
  // Mimics LIGO detection chirp: frequency accelerates from 120Hz to 680Hz
  public playGravitationalChirp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 1.4);

      osc.type = "sine";
      // LIGO frequency rise (inspiral chirp)
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.9); // D5
      osc.frequency.exponentialRampToValueAtTime(146.83, now + 1.4);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch {
      // Ignore audio error
    }
  }

  // Cosmic Warp transition into deep universe
  public playCosmicWarp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 1.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.0);
    } catch {
      // Ignore
    }
  }
}

export const cosmicAudio = new CosmicSoundEngine();
