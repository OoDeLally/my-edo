import React, { ReactNode, useContext, useState, useCallback } from 'react';
import { useShallowMemoizedObject } from './hooks';


const DEFAULT_START_OCTAVE = 3;
const DEFAULT_START_RELATIVE_CENT = 0;
const DEFAULT_RANGE_SIZE = 3;

export const HIGHEST_OCTAVE_NUMBER = 8;



interface KeyboardSettingsContextProps {
  startOctave: number;
  startRelativeCent: number;
  rangeSize: number;
  setStartOctave: (newStartOctave: number) => void;
  setStartRelativeCent: (newStartRelativeCent: number) => void;
  setRangeInOctaves: (newRangeInOctaves: number) => void;
}


const KeyboardSettingsReactContext = React.createContext<KeyboardSettingsContextProps | null>(null);



export const useKeyboardSettingsContext = () =>
  useContext(KeyboardSettingsReactContext)!;


export const KeyboardSettingsContextProvider = ({ children }: KeyboardSettingsContextProviderProps) => {
  const [startOctave, setStartOctave] = useState(DEFAULT_START_OCTAVE);
  const [rangeSize, setRangeSize] = useState(DEFAULT_RANGE_SIZE);
  const [startRelativeCent, setStartRelativeCent] = useState(DEFAULT_START_RELATIVE_CENT);


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


  const handleSetRangeInOctaves = useCallback(
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
    setStartOctave: handleSetStartOctave,
    setStartRelativeCent: handleSetStartRelativeCent,
    setRangeInOctaves: handleSetRangeInOctaves,
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
