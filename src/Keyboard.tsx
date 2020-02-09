import React, { useState } from 'react';
import { useEdoContext } from './EdoContext';
import { KeyboardKeyRow, KeyboardKeyRowProps } from './KeyboardKeyRow';

import './Keyboard.scss';


export const Keyboard = ({ startOctave, rangeInOctaves }: KeyboardProps) => {
  const { degreeCount } = useEdoContext();


  const [rows, ] = useState<Array<KeyboardKeyRowProps & { name: string }>>([
    {
      name: 'black',
      startOctave: startOctave,
      startDegree: 1,
      rangeInDegree: rangeInOctaves * degreeCount,
      degrees: ['C#', 'D#', 'F#', 'G#', 'A#'],
      keyStyleClass: 'black',
    },
    {
      name: 'white',
      startOctave: startOctave,
      startDegree: 0,
      rangeInDegree: rangeInOctaves * degreeCount + 1,
      degrees: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      keyStyleClass: 'white',
    },
  ]);



  return (
    <div className="keyboard">
      {
        rows.map(({ name, ...rowProps}) => <KeyboardKeyRow key={name} {...rowProps} />)
      }
    </div>
  );
}


interface KeyboardProps {
  startOctave: number;
  rangeInOctaves: number;
}
