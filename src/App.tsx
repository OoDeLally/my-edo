import React, { useCallback, useState } from 'react';
import './App.css';


const AudioContext = window.AudioContext;


const INTERVAL_FACTOR = Math.pow(2, 1 / 12);


const NoteKey: React.FC<NoteKeyProps> = ({ baseFrequency, ton }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const start = useCallback(() => {
    const ac = new window.AudioContext();
    const gainNode = ac.createGain();
    const oscillatorNode = ac.createOscillator();
    gainNode.connect(ac.destination)
    oscillatorNode.connect(gainNode);
    oscillatorNode.frequency.value = baseFrequency * Math.pow(INTERVAL_FACTOR, ton);
    setAudioContext(ac);
    setGainNode(gainNode);
    oscillatorNode.start();
  }, [baseFrequency, ton, setGainNode]);
  const stop = useCallback(() => {
    const delayInSec = 0.015;
    audioContext && gainNode!.gain.setTargetAtTime(0, audioContext.currentTime, delayInSec);
  }, [gainNode, audioContext]);

  return (
    <button
      className="play"
      onMouseDown={start}
      onMouseOut={stop}
      onMouseUp={stop}
    >
      {ton}
    </button>
  );
}

interface NoteKeyProps {
  baseFrequency: number;
  ton: number;
}



export default () => {

  const baseFreq = 440;

  const tonCount = 13;

  const notes = [];
  for (let t = 0; t < tonCount; t++) {
    notes.push(<NoteKey key={t} baseFrequency={baseFreq} ton={t} />);
  }

  return (
    <div className="App">
      {
        notes
      }
    </div>
  );
}
