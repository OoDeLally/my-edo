import { difference, intersection, isEqual } from 'lodash';
import React, { ReactNode, useCallback, useContext, useEffect, useRef, useMemo, SetStateAction, useState } from 'react';
import { NumberParam, useQueryParam, ArrayParam, useQueryParams } from 'use-query-params';

import { useShallowMemoizedObject, isFunction } from './hooks';
import { useTetContext } from './TetContext';
import {
  QUERY_PARAM_START_OCTAVE, QUERY_PARAM_RANGE_SIZE,
  QUERY_PARAM_KEYBOARD_LAYOUT_WHITE, QUERY_PARAM_KEYBOARD_LAYOUT_BLACK
} from './queryParams';



const DEFAULT_START_OCTAVE = 3;
const DEFAULT_RANGE_SIZE = 3;

export const HIGHEST_OCTAVE_NUMBER = 8;



type KeyboardLayout = [string[], string[]];


interface KeyboardSettingsContextProps {
  startOctave: number;
  rangeSize: number;
  layout: KeyboardLayout;
  touched: boolean;
  resetCount: number;
  setStartOctave: (newStartOctave: number) => void;
  setRangeSize: (newRangeInOctaves: number) => void;
  moveDegreeToOtherRow: (degreeName: string) => void;
  reset: () => void;
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



const useLayoutQueryParam = (initialValue: () => KeyboardLayout) => {
  const memoizedInitialValue = useRef(initialValue).current;
  const [
    {
      [QUERY_PARAM_KEYBOARD_LAYOUT_WHITE]: layoutWhiteParam,
      [QUERY_PARAM_KEYBOARD_LAYOUT_BLACK]: layoutBlackParam,
    },
    setQuery,
  ] = useQueryParams({
    [QUERY_PARAM_KEYBOARD_LAYOUT_WHITE]: ArrayParam,
    [QUERY_PARAM_KEYBOARD_LAYOUT_BLACK]: ArrayParam,
  });
  const isLayoutSetInParams = Boolean(layoutWhiteParam || layoutBlackParam);
  const layoutWhite = isLayoutSetInParams ? (layoutWhiteParam || []) : westernLayout[0];
  const layoutBlack = isLayoutSetInParams ? (layoutBlackParam || []) : westernLayout[1];
  const layout: KeyboardLayout = useMemo(
    () => (layoutWhite && layoutBlack && [[...layoutWhite], [...layoutBlack]]) || memoizedInitialValue(),
    [layoutBlack, layoutWhite, memoizedInitialValue],
  );
  return [
    layout,
    useCallback(
      (layoutSetter: SetStateAction<KeyboardLayout | undefined>) => {
        const newLayout = isFunction(layoutSetter) ? layoutSetter(layout) : layoutSetter;
        if (newLayout === undefined) {
          setQuery({
            [QUERY_PARAM_KEYBOARD_LAYOUT_WHITE]: undefined,
            [QUERY_PARAM_KEYBOARD_LAYOUT_BLACK]: undefined,
          });
          return;
        }
        if (!isEqual(newLayout[0], layout[0]) || !isEqual(newLayout[1], layout[1])) {
          setQuery({
            [QUERY_PARAM_KEYBOARD_LAYOUT_WHITE]: newLayout[0],
            [QUERY_PARAM_KEYBOARD_LAYOUT_BLACK]: newLayout[1],
          });
        }
      },
      [setQuery, layout],
    ),
  ] as const;
};


export const KeyboardSettingsContextProvider = ({ children }: KeyboardSettingsContextProviderProps) => {
  const { notes } = useTetContext();

  const [startOctave = DEFAULT_START_OCTAVE, setStartOctave] = useQueryParam(QUERY_PARAM_START_OCTAVE, NumberParam);
  const [rangeSize = DEFAULT_RANGE_SIZE, setRangeSize] = useQueryParam(QUERY_PARAM_RANGE_SIZE, NumberParam);
  const [touched, setTouched] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [layout, setLayout] = useLayoutQueryParam(() => createInitialLayout(notes));

  const handleSetLayout = useCallback(
    (newLayout: SetStateAction<KeyboardLayout | undefined>) => {
      setTouched(true);
      setLayout(newLayout);
    },
    [setLayout],
  );

  const handleSetStartOctave = useCallback(
    (newStartOctave: number) => {
      setTouched(true);
      setStartOctave(newStartOctave);
      setRangeSize(Math.min(rangeSize, HIGHEST_OCTAVE_NUMBER - newStartOctave));
    },
    [setStartOctave, setRangeSize, rangeSize],
  );

  const handleSetRangeSize = useCallback(
    (newRangeSize: number) => {
      setTouched(true);
      setRangeSize(newRangeSize);
      setStartOctave(Math.min(startOctave, HIGHEST_OCTAVE_NUMBER - newRangeSize));
    },
    [setStartOctave, setRangeSize, startOctave],
  );

  const moveDegreeToOtherRow = useCallback(
    (degreeName: string) => {
      setLayout(
        (currentLayout) => {
          if (!currentLayout) {
            return currentLayout;
          }
          const [whiteNotes, blackNotes] = currentLayout!;
          return whiteNotes.includes(degreeName)
            ? [whiteNotes.filter(note => note !== degreeName), [...blackNotes, degreeName]]
            : [[...whiteNotes, degreeName], blackNotes.filter(note => note !== degreeName)];
        }
      );
    },
    [setLayout],
  );

  useEffect(
    () => {
      setLayout(
        (currentLayout) => {
          if (!currentLayout) {
            return currentLayout;
          }
          const [whiteNotes, blackNotes] = currentLayout;
          const newWhiteNode = intersection(whiteNotes, notes);
          const newBlackNode = intersection(blackNotes, notes);
          const unknownNotes = difference(notes, newWhiteNode, newBlackNode);
          const newLayout = [[...newWhiteNode, ...unknownNotes], newBlackNode] as KeyboardLayout;
          return isEqual(newLayout, currentLayout) ? currentLayout : newLayout;
        }
      );
    },
    [notes, setLayout],
  );

  const reset = useCallback(
    () => {
      setStartOctave(undefined);
      setRangeSize(undefined);
      setLayout(undefined);
      setTouched(false);
      setResetCount(val => val + 1);
    },
    [setLayout, setRangeSize, setStartOctave],
  );
  const contextProps = useShallowMemoizedObject({
    startOctave,
    rangeSize,
    layout,
    resetCount,
    setStartOctave: handleSetStartOctave,
    setRangeSize: handleSetRangeSize,
    setLayout: handleSetLayout,
    moveDegreeToOtherRow,
    reset,
    touched,
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
