

const START_TRANSITION_DURATION_IN_MS = 50;
const STOP_TRANSITION_DURATION_IN_MS = 50;


export class Oscillator {

  private audioContext: AudioContext;
  private gainNode: GainNode;

  constructor(audioContext: AudioContext, frequency: number) {

    this.audioContext = audioContext;

    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = 0;

    const oscillatorNode = audioContext.createOscillator();
    oscillatorNode.frequency.value = frequency;
    oscillatorNode.connect(this.gainNode);
    oscillatorNode.start();
  }

  outputNode() {
    return this.gainNode;
  }

  start() {
    this.audioContext.resume();
    this.gainNode.gain.setTargetAtTime(
      1,
      this.audioContext.currentTime,
      START_TRANSITION_DURATION_IN_MS / 1000
    );
  }

  stop(callback: () => void) {
    this.gainNode.gain.setTargetAtTime(
      0,
      this.audioContext.currentTime,
      STOP_TRANSITION_DURATION_IN_MS / 1000
    );
    setTimeout(() => {
      callback();
    }, STOP_TRANSITION_DURATION_IN_MS * 10);
  }
}
