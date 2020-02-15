import classNames from 'classnames';
import React, { useMemo } from 'react';

import { KeyboardKey } from './KeyboardKey';
import { CENTS_IN_OCTAVE, useEtContext } from './EtContext';

import './App.scss';



export const KeyboardKeyRow =
  ({ startOctave, rangeSize, keyStyleClass, degrees, extraDegreeCount, shift, className }: KeyboardKeyRowProps) => {
  const { degreeSizeInCents, getNoteName, parseNote } = useEtContext();

  const keyboardKeys = useMemo(
    () => {
      const keys = [];
      if (shift !== undefined) {
        for (let i = 0; i < shift; i++) {
          keys.push(<div key={`start-half-sep-${i}`} className="key-half-separator">&nbsp;</div>);
        }
      }
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
          keys.push(<div className="key-separator" key={cent}>&nbsp;</div>);
        } else {
          skippedDegreeCount++;
        }
      }
      return keys;
    },
    [
      shift, startOctave, rangeSize, extraDegreeCount, degreeSizeInCents,
      getNoteName, parseNote, degrees, keyStyleClass
    ],
  );

  return (
    <div className={classNames('row', className)}>
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
  shift?: number;
  className?: string;
}
