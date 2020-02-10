import { useState, useCallback } from 'react';import { KeyboardKeyRowProps } from './KeyboardKeyRow';


const DEFAULT_LAYOUT = [
  {
    startDegree: 1,
    degrees: ['C#', 'D#', 'F#', 'G#', 'A#'],
    keyStyleClass: 'black',
    shift: 1,
  },
  {
    startDegree: 0,
    degrees: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    keyStyleClass: 'white',
  },
] as const;


export const useKeyRows = () => {
  // const [keyRows, setKeyRows] = useState<KeyboardKeyRowProps[]>(
  //   () => {

  //   }
  // );


  // const handleSetKeyRows = useCallback(
  //   () => {
  //     callback
  //   },
  //   [input],
  // )

  // return [keyRows, handleSetKeyRows];
};
