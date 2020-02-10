import classNames from 'classnames';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useAudioContext } from './AudioContext';
import { useEdoContext } from './EdoContext';
import { Oscillator } from './Oscillator';



export const KeyboardKey = ({ note, keyStyleClass }: NoteKeyProps) => {
  const { getFrequency, parseNote } = useEdoContext();
  const { audioContext, connectGain } = useAudioContext();
  const disconnectGainRef = useRef<(() => void) | null>(null);
  const oscRef = useRef<Oscillator | null>(null);
  const [isHeld, setIsHeld] = useState(false);
  const [oscillatorPlayingCount, setOscillatorPlayingCount] = useState(0);
  const frequency = useMemo(() => getFrequency(note), [getFrequency, note]);


  const start = useCallback(
    () => {
      const osc = new Oscillator(audioContext, frequency);
      disconnectGainRef.current = connectGain(osc.outputNode());
      osc.start();
      oscRef.current = osc;
      setOscillatorPlayingCount(val => val + 1);
    },
    [audioContext, connectGain, setOscillatorPlayingCount, frequency, oscRef, disconnectGainRef],
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
            setOscillatorPlayingCount(val => val - 1);
          }
        );
      }
    },
    [oscRef, disconnectGainRef, setOscillatorPlayingCount],
  );

  const toggleHold = useCallback(
    () => {
      setIsHeld(val => !val);
    },
    [setIsHeld],
  );

  const handleMouseDown = useCallback(
    () => {
      if (!isHeld) {
        start();
      }
    },
    [isHeld, start],
  );


  const handleMouseUp = useCallback(
    () => {
      if (!isHeld) {
        stop();
      }
    },
    [isHeld, stop],
  );

  useEffect(() => {
    if (isHeld) {
      start();
    } else {
      stop();
    }
  }, [isHeld, start, stop])

  const label = useMemo(
    () => parseNote(note)[0],
    [note, parseNote],
  );

  const isPlaying = oscillatorPlayingCount > 0;
  return (
    <button
      className={classNames('note-key', keyStyleClass, isPlaying && 'playing')}
      onAuxClick={toggleHold}
      onMouseDown={handleMouseDown}
      onMouseOut={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {label}
    </button>
  );
}

interface NoteKeyProps {
  note: string;
  keyStyleClass?: string;
}


