import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useEdoContext } from './EdoContext';


const audioContext = new window.AudioContext();



export const KeyboardKey = ({ note }: NoteKeyProps) => {
  const { getFrequency, parseNote } = useEdoContext();
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
      osc.frequency.value = getFrequency(note);
      osc.connect(gainNode);
      osc.start();
    },
    [note, gainNode, getFrequency],
  );
  const start = useCallback(() => {
    audioContext.resume();
    gainNode.gain.setTargetAtTime(0.3, audioContext.currentTime, 0.05);
    setIsPlaying(true);
  }, [gainNode, setIsPlaying]);
  const stop = useCallback(() => {
    gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.05);
    setIsPlaying(false);
  }, [gainNode, setIsPlaying]);

  const label = useMemo(
    () => parseNote(note)[0],
    [note, parseNote],
  );
  return (
    <button
      className={classNames('note-key', isPlaying && 'playing')}
      onMouseDown={start}
      onMouseOut={stop}
      onMouseUp={stop}
    >
      {label}
    </button>
  );
}

interface NoteKeyProps {
  note: string;
}


