import classNames from 'classnames';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useAudioContext } from './AudioContext';
import { useEdoContext } from './EdoContext';
import { Oscillator } from './Oscillator';



export const KeyboardKey = ({ note, keyStyleClass }: NoteKeyProps) => {
  const { getFrequency, parseNote } = useEdoContext();
  const { audioContext, connectGain } = useAudioContext();
  const disconnectGainRef = useRef<(() => void) | null>(null);
  const oscRef = useRef<Oscillator | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const frequency = useMemo(() => getFrequency(note), [getFrequency, note]);


  const start = useCallback(
    () => {
      const osc = new Oscillator(audioContext, frequency);
      disconnectGainRef.current = connectGain(osc.outputNode());
      osc.start();
      oscRef.current = osc;
      setIsPlaying(true);
    },
    [audioContext, connectGain, setIsPlaying, frequency, oscRef, disconnectGainRef],
  );
  const stop = useCallback(
    () => {
      const oscillator = oscRef.current;
      oscRef.current = null;
      if (oscillator) {
        const disconnectGain = disconnectGainRef.current!;
        disconnectGainRef.current = null;
        oscillator.stop(
          () => {
            disconnectGain();
            setIsPlaying(false);
          }
        );
      }
    },
    [oscRef, disconnectGainRef, setIsPlaying],
  );

  const label = useMemo(
    () => parseNote(note)[0],
    [note, parseNote],
  );
  return (
    <button
      className={classNames('note-key', keyStyleClass, isPlaying && 'playing')}
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
  keyStyleClass?: string;
}


