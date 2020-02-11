import { difference, intersection, isEqual } from 'lodash';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { NumberParam, useQueryParam } from 'use-query-params';

import { useShallowMemoizedObject } from './hooks';
import { useTetContext } from './TetContext';
import { QUERY_PARAM_START_OCTAVE, QUERY_PARAM_RANGE_SIZE } from './queryParams';



const DEFAULT_START_OCTAVE = 3;
const DEFAULT_RANGE_SIZE = 3;

export const HIGHEST_OCTAVE_NUMBER = 8;



type KeyboardLayout = [string[], string[]];


interface KeyboardSettingsContextProps {
  startOctave: number;
  rangeSize: number;
  layout: KeyboardLayout;
  setStartOctave: (newStartOctave: number) => void;
  setRangeSize: (newRangeInOctaves: number) => void;
  moveDegreeToOtherRow: (degreeName: string) => void;
}


const KeyboardSettingsReactContext = React.createContext<KeyboardSettingsContextProps | null>(null);


const westernLayout: KeyboardLayout = [['C', 'D', 'E', 'F', 'G', 'A', 'B'], ['C#', 'D#', 'F#', 'G#', 'A#']];

const createInitialLayout = (notes: string[]) => {
  const allWesternNotes = westernLayout.flat();
  if (isEqual([...notes].sort(), [...allWesternNotes].sort())) {
    return westernLayout;
  } else {
    return [notes, []] as KeyboardLayout;
  }
};


export const useKeyboardSettingsContext = () =>
  useContext(KeyboardSettingsReactContext)!;


export const KeyboardSettingsContextProvider = ({ children }: KeyboardSettingsContextProviderProps) => {
  const { notes } = useTetContext();

  const [startOctave = DEFAULT_START_OCTAVE, setStartOctave] = useQueryParam(QUERY_PARAM_START_OCTAVE, NumberParam);
  const [rangeSize = DEFAULT_RANGE_SIZE, setRangeSize] = useQueryParam(QUERY_PARAM_RANGE_SIZE, NumberParam);

  const [layout, setLayout] = useState<KeyboardLayout>(() => createInitialLayout(notes));

  const handleSetStartOctave = useCallback(
    (newStartOctave: number) => {
      setStartOctave(newStartOctave);
      setRangeSize(Math.min(rangeSize, HIGHEST_OCTAVE_NUMBER - newStartOctave));
    },
    [setStartOctave, setRangeSize, rangeSize],
  );

  const handleSetRangeSize = useCallback(
    (newRangeSize: number) => {
      setRangeSize(newRangeSize);
      setStartOctave(Math.min(startOctave, HIGHEST_OCTAVE_NUMBER - newRangeSize));
    },
    [setStartOctave, setRangeSize, startOctave],
  );

  const moveDegreeToOtherRow = useCallback(
    (degreeName: string) => {
      setLayout(
        ([whiteNotes, blackNotes]) =>
          whiteNotes.includes(degreeName)
            ? [whiteNotes.filter(note => note !== degreeName), [...blackNotes, degreeName]]
            : [[...whiteNotes, degreeName], blackNotes.filter(note => note !== degreeName)]
      );
    },
    [setLayout],
  );

  useEffect(
    () => {
      setLayout(
        ([whiteNotes, blackNotes]) => {
          const newWhiteNode = intersection(whiteNotes, notes);
          const newBlackNode = intersection(blackNotes, notes);
          const unknownNotes = difference(notes, newWhiteNode, newBlackNode);
          return [[...newWhiteNode, ...unknownNotes], newBlackNode] as KeyboardLayout;
        }
      );
    },
    [notes],
  );

  const contextProps = useShallowMemoizedObject({
    startOctave,
    rangeSize,
    layout,
    setStartOctave: handleSetStartOctave,
    setRangeSize: handleSetRangeSize,
    setLayout,
    moveDegreeToOtherRow,
  });

  return (
    <KeyboardSettingsReactContext.Provider value={contextProps}>
      {children}
    </KeyboardSettingsReactContext.Provider>
  );
};


interface KeyboardSettingsContextProviderProps {
  children: ReactNode;
}
