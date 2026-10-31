// Browser-native Audio Context Engine Synthesizer
export class EngineSoundSynth {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private isRunning: boolean = false;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();
  }

  public start() {
    this.init();
    if (!this.ctx || this.isRunning) return;

    this.osc = this.ctx.createOscillator();
    this.gain = this.ctx.createGain();

    this.osc.type = "sawtooth";
    this.osc.frequency.setValueAtTime(60, this.ctx.currentTime); // Base Idle RPM sound

    this.gain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.osc.connect(this.gain);
    this.gain.connect(this.ctx.destination);

    this.osc.start();
    this.isRunning = true;
  }

  public rev() {
    if (!this.ctx || !this.osc || !this.isRunning) return;
    const now = this.ctx.currentTime;
    this.osc.frequency.cancelScheduledValues(now);
    this.osc.frequency.setValueAtTime(60, now);
    this.osc.frequency.exponentialRampToValueAtTime(320, now + 0.4); // Throttle up
    this.osc.frequency.exponentialRampToValueAtTime(65, now + 1.2);  // Return to idle
  }

  public stop() {
    if (this.osc) {
      this.osc.stop();
      this.osc.disconnect();
      this.isRunning = false;
    }
  }
}