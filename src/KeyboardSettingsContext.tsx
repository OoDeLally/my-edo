import React, { ReactNode, useContext, useState, useEffect, useCallback } from 'react';
import { useShallowMemoizedObject } from './hooks';


const DEFAULT_STARTING_OCTAVE = 3;
const DEFAULT_RANGE_IN_OCTAVE = 3;
const HIGHEST_OCTAVE_NUMBER = 10;





interface KeyboardSettingsContextProps {
  startOctave: number;
  rangeInOctaves: number;
  setStartOctave: (newStartOctave: number) => void;
  setRangeInOctaves: (newRangeInOctaves: number) => void;
}


const KeyboardSettingsReactContext = React.createContext<KeyboardSettingsContextProps | null>(null);



export const useKeyboardSettingsContext = () =>
  useContext(KeyboardSettingsReactContext)!;


export const KeyboardSettingsContextProvider = ({ children }: KeyboardSettingsContextProviderProps) => {
  const [startOctave, setStartOctave] = useState(DEFAULT_STARTING_OCTAVE);
  const [rangeInOctaves, setRangeInOctaves] = useState(DEFAULT_RANGE_IN_OCTAVE);


  const handleSetStartOctave =

  const contextProps = useShallowMemoizedObject({
    startOctave,
    rangeInOctaves,
    setStartOctave: handleSetStartOctave,
    setRangeInOctaves,
  });

  return (
    <KeyboardSettingsReactContext.Provider value={contextProps}>
      {children}
    </KeyboardSettingsReactContext.Provider>
  )
}


interface KeyboardSettingsContextProviderProps {
  children: ReactNode;
}
