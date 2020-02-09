import React, { useContext, ReactNode, useState, useCallback } from 'react';
import { useShallowMemoizedObject } from './hooks';


export const CENTS_IN_OCTAVE = 1200;
export const FREQUENCY_OFFSET = 16.35; // C0
export const INTERCENT_FACTOR = Math.pow(2, 1 / CENTS_IN_OCTAVE);


const defaultNotes = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];


interface EdoContextProps {
  notes: string[];
  degreeCountPerOctave: number;
  degreeSizeInCents: number;
  setNotes: (notes: string[]) => void;
  getNoteName: (cents: number) => string;
  // parseNote('C4') => ['C', 4, 0]
  // parseNote('D4') => ['D', 4, 1]
  parseNote: (note: string) => readonly [string, number, number];
  getCent: (note: string) => number;
  getFrequency: (note: string) => number;
}


const EdoReactContext = React.createContext<EdoContextProps | null>(null);



export const useEdoContext = () =>
  useContext(EdoReactContext)!;


export const EdoContextProvider = ({ children }: EdoContextProviderProps) => {
  const [notes, setNotes] = useState<string[]>(defaultNotes);

  const degreeSizeInCents = CENTS_IN_OCTAVE / notes.length;


  const getNoteName = useCallback(
    (cents: number) => {
      const roundedCents = Math.round(cents);
      const octaveNum = Math.floor(roundedCents / CENTS_IN_OCTAVE);
      const degree = (roundedCents % CENTS_IN_OCTAVE) / degreeSizeInCents;
      const note = notes[Math.round(degree)];
      if (!note) {
        throw new Error(`Could not find name for degree ${degree}`)
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
      const [, noteName, octaveNum] = match;
      const noteDegree = notes.findIndex(v => v === noteName);
      if (noteDegree === -1) {
        throw new Error(`Could not find note name ${note}`);
      }
      return [noteName, +octaveNum, noteDegree] as const;
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
      return FREQUENCY_OFFSET * Math.pow(INTERCENT_FACTOR, getCent(note));
    },
    [getCent],
  );

  const contextProps = useShallowMemoizedObject({
    notes,
    setNotes,
    degreeCountPerOctave: notes.length,
    degreeSizeInCents,
    getNoteName,
    parseNote,
    getCent,
    getFrequency,
  });

  return (
    <EdoReactContext.Provider value={contextProps}>
      {children}
    </EdoReactContext.Provider>
  )
}


interface EdoContextProviderProps {
  children: ReactNode;
}
