import React, { useMemo } from 'react';
import { AudioContextProvider } from './AudioContext';
import { useEdoContext } from './EdoContext';
import { KeyboardKeyRow } from './KeyboardKeyRow';

import './Keyboard.scss';


export const Keyboard = ({ startOctave, rangeInOctaves }: KeyboardProps) => {
  const { degreeCountPerOctave } = useEdoContext();

  const rows = useMemo(
    () => {
      return [
        {
          name: 'black',
          startOctave: startOctave,
          startDegree: 1,
          rangeInDegree: rangeInOctaves * degreeCountPerOctave,
          degrees: ['C#', 'D#', 'F#', 'G#', 'A#'],
          keyStyleClass: 'black',
          shift: 1,
        },
        {
          name: 'white',
          startOctave: startOctave,
          startDegree: 0,
          rangeInDegree: rangeInOctaves * degreeCountPerOctave + 1,
          degrees: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
          keyStyleClass: 'white',
        },
      ]
    },
    [startOctave, rangeInOctaves, degreeCountPerOctave],
  )


  return (
    <div className="keyboard">
      <AudioContextProvider>
        {
          rows.map(({ name, ...rowProps}) => <KeyboardKeyRow key={name} {...rowProps} />)
        }
      </AudioContextProvider>
      <p className="info">( Middle-Click: Hold the key )</p>
    </div>
  );
}


interface KeyboardProps {
  startOctave: number;
  rangeInOctaves: number;
}
