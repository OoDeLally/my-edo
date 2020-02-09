import React, { useMemo } from 'react';
import { useEdoContext } from './EdoContext';
import './Keyboard.scss';
import { KeyboardKeyRow } from './KeyboardKeyRow';



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
