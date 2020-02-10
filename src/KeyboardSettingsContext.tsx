import { isEqual } from 'lodash';
import React, { ReactNode, useCallback, useContext, useState } from 'react';

import { useShallowMemoizedObject } from './hooks';
import { useTetContext } from './TetContext';




const DEFAULT_START_OCTAVE = 3;
const DEFAULT_START_RELATIVE_CENT = 0;
const DEFAULT_RANGE_SIZE = 3;

export const HIGHEST_OCTAVE_NUMBER = 8;



type KeyboardLayout = [string[], string[]];


interface KeyboardSettingsContextProps {
  startOctave: number;
  startRelativeCent: number;
  rangeSize: number;
  layout: KeyboardLayout;
  setStartOctave: (newStartOctave: number) => void;
  setStartRelativeCent: (newStartRelativeCent: number) => void;
  setRangeSize: (newRangeInOctaves: number) => void;
  moveDegreeToOtherRow: (degreeName: string) => void;
}


const KeyboardSettingsReactContext = React.createContext<KeyboardSettingsContextProps | null>(null);


const westernLayout: KeyboardLayout = [['C', 'D', 'E', 'F', 'G', 'A', 'B'], ['C#', 'D#', 'F#', 'G#', 'A#']];

const createInitialLayout = (notes: string[]) => {
  const allWesternNotes = westernLayout.flat();
  if (isEqual(notes.sort(), allWesternNotes.sort())) {
    return westernLayout;
  } else {
    return [notes, []] as KeyboardLayout;
  }
};


export const useKeyboardSettingsContext = () =>
  useContext(KeyboardSettingsReactContext)!;


export const KeyboardSettingsContextProvider = ({ children }: KeyboardSettingsContextProviderProps) => {
  const { notes } = useTetContext();
  const [startOctave, setStartOctave] = useState(DEFAULT_START_OCTAVE);
  const [rangeSize, setRangeSize] = useState(DEFAULT_RANGE_SIZE);
  const [startRelativeCent, setStartRelativeCent] = useState(DEFAULT_START_RELATIVE_CENT);
  const [layout, setLayout] = useState<KeyboardLayout>(() => createInitialLayout(notes));

  const handleSetStartOctave = useCallback(
    (newStartOctave: number) => {
      setStartOctave(newStartOctave);
      setRangeSize(Math.min(rangeSize, HIGHEST_OCTAVE_NUMBER - newStartOctave));
    },
    [setStartOctave, setRangeSize, rangeSize],
  );

  const handleSetStartRelativeCent = useCallback(
    (newStartRelativeCent: number) => {
      setStartRelativeCent(newStartRelativeCent);
    },
    [setStartRelativeCent],
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

  const contextProps = useShallowMemoizedObject({
    startOctave,
    startRelativeCent,
    rangeSize,
    layout,
    setStartOctave: handleSetStartOctave,
    setStartRelativeCent: handleSetStartRelativeCent,
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
