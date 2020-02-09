import React, { useMemo } from 'react';
import { CENTS_IN_OCTAVE, useEdoContext } from './EdoContext';
import { KeyboardKey } from './KeyboardKey';

import './App.scss';



export const KeyboardKeyRow =
  ({ startOctave, startDegree, rangeInDegree, keyStyleClass, degrees, shift }: KeyboardKeyRowProps) => {
  const { degreeSizeInCents, getNoteName, parseNote } = useEdoContext();

  const keyboardKeys = useMemo(
    () => {
      const keys = [];
      if (shift !== undefined) {
        for (let i = 0; i < shift; i++) {
          keys.push(<div key={`start-half-sep-${i}`} className="key-half-separator">&nbsp;</div>)
        }
      }
      const startCent = startOctave * CENTS_IN_OCTAVE + startDegree * degreeSizeInCents;
      const end = startCent + rangeInDegree * degreeSizeInCents;
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
      degrees, degreeSizeInCents, getNoteName, startOctave, parseNote,
      startDegree, rangeInDegree, keyStyleClass, shift,
    ],
  );

  return (
    <div className="row">
      {keyboardKeys}
    </div>
  );
}


export interface KeyboardKeyRowProps {
  startOctave: number;
  startDegree: number;
  rangeInDegree: number;
  degrees: string[];
  keyStyleClass?: string;
  shift?: number;
}
