import React, { useMemo } from 'react';
import { CENTS_IN_OCTAVE, useEdoContext } from './EdoContext';
import { KeyboardKey } from './KeyboardKey';

import './App.scss';


export const KeyboardKeyRow = ({ startOctave, startDegree, rangeInDegree, stepSizeInDegree }: KeyboardKeyRowProps) => {
  const { degreeSizeInCents, getNoteName } = useEdoContext();

  const keyboardKeys = useMemo(
    () => {
      const keys = [];
      const startCent = startOctave * CENTS_IN_OCTAVE + startDegree * degreeSizeInCents;
      const step = stepSizeInDegree * degreeSizeInCents;
      const end = startCent + rangeInDegree * degreeSizeInCents;
      for (let cent = startCent; cent < end; cent += step) {
        keys.push(
          <KeyboardKey key={cent} note={getNoteName(cent)} />
        );
      }
      return keys;
    },
    [degreeSizeInCents, getNoteName, startOctave, startDegree, rangeInDegree, stepSizeInDegree],
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
  stepSizeInDegree: number;
}
