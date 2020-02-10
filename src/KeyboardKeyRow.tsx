import React, { useMemo } from 'react';
import { CENTS_IN_OCTAVE, useTetContext } from './TetContext';
import { KeyboardKey } from './KeyboardKey';

import './App.scss';



export const KeyboardKeyRow =
  ({ startOctave, rangeSize, keyStyleClass, degrees, extraDegreeCount }: KeyboardKeyRowProps) => {
  const { degreeSizeInCents, getNoteName, parseNote } = useTetContext();

  const keyboardKeys = useMemo(
    () => {
      const keys = [];
      const startCent = startOctave * CENTS_IN_OCTAVE;
      const end = startCent + rangeSize * CENTS_IN_OCTAVE + extraDegreeCount * degreeSizeInCents;
      let skippedDegreeCount = 0;
      for (let cent = startCent; cent < end; cent += degreeSizeInCents) {
        const note = getNoteName(cent);
        const [degreeName] = parseNote(note);
        const shouldShow = degrees.includes(degreeName);
        if (shouldShow) {
          skippedDegreeCount = 0;
          keys.push(<KeyboardKey key={cent} note={note} keyStyleClass={keyStyleClass} />);
        } else if (skippedDegreeCount > 0) {
          skippedDegreeCount = 0;
          keys.push(<div className="key-separator" key={cent}>&nbsp;</div>);
        } else {
          skippedDegreeCount++;
        }
      }
      return keys;
    },
    [
      startOctave, rangeSize, extraDegreeCount, degreeSizeInCents,
      getNoteName, parseNote, degrees, keyStyleClass
    ],
  );

  return (
    <div className="row">
      {keyboardKeys}
    </div>
  );
};


export interface KeyboardKeyRowProps {
  startOctave: number;
  rangeSize: number; // in number of octaves.
  extraDegreeCount: number;
  degrees: string[];
  keyStyleClass?: string;
}
