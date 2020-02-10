import React, { ReactNode, useCallback, useContext, useState } from 'react';

import { useShallowMemoizedObject } from './hooks';


export const CENTS_IN_OCTAVE = 1200;
export const DEFAUL_BASE_FREQUENCY = 16.35; // C0
export const INTERCENT_FACTOR = Math.pow(2, 1 / CENTS_IN_OCTAVE);


const defaultNotes = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];


interface TetContextProps {
  baseFrequency: number;
  notes: string[];
  degreeCountPerOctave: number;
  degreeSizeInCents: number;
  setBaseFrequency: (baseFrequency: number) => void;
  setNotes: (notes: string[]) => void;
  getNoteName: (cents: number) => string;
  // parseNote('C4') => ['C', 4, 0]
  // parseNote('D4') => ['D', 4, 1]
  parseNote: (note: string) => readonly [string, number, number];
  getCent: (note: string) => number;
  getFrequency: (note: string) => number;
}


const TetReactContext = React.createContext<TetContextProps | null>(null);



export const useTetContext = () =>
  useContext(TetReactContext)!;


export const TetContextProvider = ({ children }: TetContextProviderProps) => {
  const [baseFrequency, setBaseFrequency] = useState(DEFAUL_BASE_FREQUENCY);
  const [notes, setNotes] = useState<string[]>(defaultNotes);

  const degreeSizeInCents = CENTS_IN_OCTAVE / notes.length;

  const getNoteName = useCallback(
    (cents: number) => {
      const roundedCents = Math.round(cents);
      const octaveNum = Math.floor(roundedCents / CENTS_IN_OCTAVE);
      const degree = (roundedCents % CENTS_IN_OCTAVE) / degreeSizeInCents;
      const note = notes[Math.round(degree)];
      if (!note) {
        throw new Error(`Could not find name for degree ${degree}`);
      }
      return `${note}${octaveNum}`;
    },
    [notes, degreeSizeInCents],
  );

  const parseNote = useCallback(
    (note: string) => {
      const match = note.match(/^([^0-9 ]+)([0-9]+)$/);
      if (!match) {
        throw new Error(`Could not parse note ${note}`);
      }
      const [, degreeName, octaveNum] = match;
      const degreeIndex = notes.findIndex(v => v === degreeName);
      if (degreeIndex === -1) {
        throw new Error(`Could not find note name ${note}`);
      }
      return [degreeName, +octaveNum, degreeIndex] as const;
    },
    [notes],
  );

  const getCent = useCallback(
    (note: string) => {
      const [, octaveNum, noteDegree] = parseNote(note);
      return CENTS_IN_OCTAVE * octaveNum + noteDegree * degreeSizeInCents;
    },
    [degreeSizeInCents, parseNote],
  );

  const getFrequency = useCallback(
    (note: string) => {
      return baseFrequency * Math.pow(INTERCENT_FACTOR, getCent(note));
    },
    [getCent, baseFrequency],
  );

  const contextProps = useShallowMemoizedObject({
    notes,
    setNotes,
    baseFrequency,
    setBaseFrequency,
    degreeCountPerOctave: notes.length,
    degreeSizeInCents,
    getNoteName,
    parseNote,
    getCent,
    getFrequency,
  });

  return (
    <TetReactContext.Provider value={contextProps}>
      {children}
    </TetReactContext.Provider>
  );
};


interface TetContextProviderProps {
  children: ReactNode;
}
