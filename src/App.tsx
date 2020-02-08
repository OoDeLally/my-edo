import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import './App.css';




const INTERVAL_FACTOR = Math.pow(2, 1 / 12);

const audioContext = new window.AudioContext();


const NoteKey: React.FC<NoteKeyProps> = ({ baseFrequency, ton }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const gainNode = useMemo(
    () => {
      const node = audioContext.createGain();
      node.connect(audioContext.destination);
      node.gain.value = 0;
      return node;
    },
    [],
  );
  useEffect(
    () => {
      const osc = audioContext.createOscillator();
      osc.frequency.value = baseFrequency * Math.pow(INTERVAL_FACTOR, ton);
      osc.connect(gainNode);
      osc.start();
    },
    [ baseFrequency, ton, gainNode],
  );
  const start = useCallback(() => {
    audioContext.resume();
    gainNode.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.05);
    setIsPlaying(true);
  }, [gainNode, setIsPlaying]);
  const stop = useCallback(() => {
    gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.05);
    setIsPlaying(false);
  }, [gainNode, setIsPlaying]);

  return (
    <button
      className={classNames('note-key', isPlaying && 'playing')}
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
  const octaveCount = 3;

  const whiteNotes = [];
  for (let t = 0; t < 12 * octaveCount + 1; t += 2) {
    whiteNotes.push(<NoteKey key={t} baseFrequency={baseFreq} ton={t} />);
  }
  const blackNotes = [];
  for (let t = 1; t < 12 * octaveCount; t += 2) {
    blackNotes.push(<NoteKey key={t} baseFrequency={baseFreq} ton={t} />);
  }

  return (
    <div className="App">
      <div className="black-row">
        { blackNotes }
      </div>
      <div className="white-row">
        { whiteNotes }
      </div>
    </div>
  );
}
