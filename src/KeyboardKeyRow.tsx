import React, { useMemo } from 'react';
import { CENTS_IN_OCTAVE, useEdoContext } from './EdoContext';
import { KeyboardKey } from './KeyboardKey';

import './App.scss';



export const KeyboardKeyRow =
  ({ startOctave, startDegree, rangeInDegree, keyStyleClass, degrees }: KeyboardKeyRowProps) => {
  const { degreeSizeInCents, getNoteName, parseNote } = useEdoContext();

  const keyboardKeys = useMemo(
    () => {
      const keys = [];
      const startCent = startOctave * CENTS_IN_OCTAVE + startDegree * degreeSizeInCents;
      const step = 1 * degreeSizeInCents;
      const end = startCent + rangeInDegree * degreeSizeInCents;
      for (let cent = startCent; cent < end; cent += step) {
        const note = getNoteName(cent);
        console.log('note :', note);
        const [degreeName] = parseNote(note);
        console.log('degreeName :', degreeName);
        keys.push(
          degrees.includes(degreeName)
            ? <KeyboardKey key={cent} note={note} keyStyleClass={keyStyleClass} />
            : <div className="key-separator" key={cent}>&nbsp;</div>
        );
      }
      return keys;
    },
    [
      degrees, degreeSizeInCents, getNoteName, startOctave, parseNote,
      startDegree, rangeInDegree, keyStyleClass
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
}
