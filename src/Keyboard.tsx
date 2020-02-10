import React from 'react';
import { AudioContextProvider } from './AudioContext';

import { KeyboardKeyRow } from './KeyboardKeyRow';
import { useKeyboardSettingsContext } from './KeyboardSettingsContext';

import './Keyboard.scss';
import { useTetContext } from './TetContext';



export const Keyboard = () => {
  const { notes } = useTetContext();
  const { layout: [whiteNotes, blackNotes], startOctave, rangeSize } = useKeyboardSettingsContext();
  const firstNote = notes[0];
  const whiteRowShift = whiteNotes.includes(firstNote) ? 0 : 1;
  const blackRowShift = blackNotes.includes(firstNote) ? 0 : 1;
  return (
    <div className="keyboard">
      <AudioContextProvider>
        {
          blackNotes.length > 0 && (
            <KeyboardKeyRow
              startOctave={startOctave}
              rangeSize={rangeSize}
              degrees={blackNotes}
              keyStyleClass='black'
              extraDegreeCount={0}
              shift={blackRowShift}
            />
          )
        }
        <KeyboardKeyRow
          startOctave={startOctave}
          rangeSize={rangeSize}
          degrees={whiteNotes}
          keyStyleClass='white'
          extraDegreeCount={1}
          shift={whiteRowShift}
        />
      </AudioContextProvider>
      <p className="info">( Middle-Click: Hold the key )</p>
    </div>
  );
};
