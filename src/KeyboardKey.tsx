import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAudioContext } from './AudioContext';
import { useIsComponentMounted } from './hooks';
import { useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { Oscillator } from './Oscillator';
import { useTetContext } from './TetContext';



export const KeyboardKey = ({ note, keyStyleClass }: NoteKeyProps) => {
  const isComponentMountedRef = useIsComponentMounted();
  const { getFrequency, parseNote } = useTetContext();
  const { moveDegreeToOtherRow } = useKeyboardSettingsContext();
  const { audioContext, connectNode } = useAudioContext();
  const disconnectNodeRef = useRef<(() => void) | null>(null);
  const oscRef = useRef<Oscillator | null>(null);
  const [isHeld, setIsHeld] = useState(false);
  const [oscillatorPlayingCount, setOscillatorPlayingCount] = useState(0);
  const frequency = useMemo(() => getFrequency(note), [getFrequency, note]);


  const start = useCallback(
    () => {
      const osc = new Oscillator(audioContext, frequency);
      disconnectNodeRef.current = connectNode(osc.outputNode());
      osc.start();
      oscRef.current = osc;
      setOscillatorPlayingCount(val => val + 1);
    },
    [audioContext, connectNode, setOscillatorPlayingCount, frequency, oscRef, disconnectNodeRef],
  );
  const stop = useCallback(
    () => {
      const oscillator = oscRef.current;
      oscRef.current = null;
      if (oscillator) {
        const disconnectGain = disconnectNodeRef.current!;
        disconnectNodeRef.current = null;
        oscillator.stop(
          () => {
            if (isComponentMountedRef.current) {
              disconnectGain();
              setOscillatorPlayingCount(val => val - 1);
            }
          }
        );
      }
    },
    [oscRef, disconnectNodeRef, setOscillatorPlayingCount, isComponentMountedRef],
  );

  const degreeName = useMemo(
    () => parseNote(note)[0],
    [note, parseNote],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const isMiddleClick = event.buttons === 4;
      if (isMiddleClick) {
        setIsHeld(val => !val);
        return;
      }
      const isRightClick = event.buttons === 2;
      if (isRightClick) {
        moveDegreeToOtherRow(degreeName);
        return;
      }
      if (!isHeld) {
        const isLeftClick = event.buttons === 1;
        if (isLeftClick) {
          start();
        }
      }
    },
    [isHeld, start, setIsHeld, moveDegreeToOtherRow, degreeName],
  );


  const handleMouseUp = useCallback(
    () => {
      if (!isHeld) {
        stop();
      }
    },
    [isHeld, stop],
  );


  const handleMouseOver = useCallback(
    (event: React.MouseEvent) => {
      if (isHeld) {
        return;
      }
      const isMouseClickDown = event.buttons & 1; // eslint-disable-line no-bitwise
      if (isMouseClickDown) {
        start();
      }
    },
    [isHeld, start],
  );



  useEffect(() => {
    if (isHeld) {
      start();
    } else {
      stop();
    }
  }, [isHeld, start, stop]);


  const octaveNum = useMemo(
    () => parseNote(note)[1],
    [note, parseNote],
  );

  const isPlaying = oscillatorPlayingCount > 0;
  return (
    <button
      className={classNames('note-key', keyStyleClass, isPlaying && 'playing')}
      onMouseDown={handleMouseDown}
      onMouseOut={handleMouseUp}
      onMouseUp={handleMouseUp}
      onMouseOver={handleMouseOver}
    >
      <p className="title">{degreeName}</p>
      <p className="subtitle">{octaveNum}</p>
    </button>
  );
};

interface NoteKeyProps {
  note: string;
  keyStyleClass?: string;
}


