import React, { useState } from 'react';
import { useEdoContext } from './EdoContext';
import { KeyboardKeyRow, KeyboardKeyRowProps } from './KeyboardKeyRow';

import './Keyboard.scss';


export const Keyboard = ({ startOctave, rangeInOctaves }: KeyboardProps) => {
  const { degreeCount } = useEdoContext();


  const [rows, setRow] = useState<Array<KeyboardKeyRowProps & { name: string}>>([
    {
      name: 'white',
      startOctave: 3,
      startDegree: 0,
      rangeInDegree: rangeInOctaves * degreeCount,
      stepSizeInDegree: 2,
    },
    {
      name: 'black',
      startOctave: 3,
      startDegree: 1,
      rangeInDegree: rangeInOctaves * degreeCount,
      stepSizeInDegree: 2,
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
