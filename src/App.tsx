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
      node.gain.setTargetAtTime(0, audioContext.currentTime, 0);
      return node;
    },
    [],
  );
  useEffect(
    () => {
      const node = audioContext.createOscillator();
      node.frequency.value = baseFrequency * Math.pow(INTERVAL_FACTOR, ton);
      node.connect(gainNode);
      node.start();
    },
    [ baseFrequency, ton, gainNode],
  );
  const start = useCallback(() => {
    audioContext.resume();
    gainNode.gain.setTargetAtTime(1, audioContext.currentTime, 0.05);
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
