import React, { ReactNode, useCallback, useContext, useState } from 'react';

import { useShallowMemoizedObject } from './hooks';
import { useTetContext } from './TetContext';


const DEFAULT_START_OCTAVE = 3;
const DEFAULT_START_RELATIVE_CENT = 0;
const DEFAULT_RANGE_SIZE = 3;

export const HIGHEST_OCTAVE_NUMBER = 8;


interface KeyboardRowSettings {
  notes: string[];
  keyStyleClass: string;
}


interface KeyboardSettingsContextProps {
  startOctave: number;
  startRelativeCent: number;
  rangeSize: number;
  rowSettings: KeyboardRowSettings[];
  setStartOctave: (newStartOctave: number) => void;
  setStartRelativeCent: (newStartRelativeCent: number) => void;
  setRangeSize: (newRangeInOctaves: number) => void;
  setRowSettings: (rows: KeyboardRowSettings[]) => void;
}


const KeyboardSettingsReactContext = React.createContext<KeyboardSettingsContextProps | null>(null);



export const useKeyboardSettingsContext = () =>
  useContext(KeyboardSettingsReactContext)!;


export const KeyboardSettingsContextProvider = ({ children }: KeyboardSettingsContextProviderProps) => {
  const { notes } = useTetContext();
  const [startOctave, setStartOctave] = useState(DEFAULT_START_OCTAVE);
  const [rangeSize, setRangeSize] = useState(DEFAULT_RANGE_SIZE);
  const [startRelativeCent, setStartRelativeCent] = useState(DEFAULT_START_RELATIVE_CENT);
  const [rowSettings, setRowSettings] = useState<KeyboardRowSettings[]>([{
    notes, keyStyleClass: 'white',
  }]);

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

  const contextProps = useShallowMemoizedObject({
    startOctave,
    startRelativeCent,
    rangeSize,
    rowSettings,
    setStartOctave: handleSetStartOctave,
    setStartRelativeCent: handleSetStartRelativeCent,
    setRangeSize: handleSetRangeSize,
    setRowSettings,
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
