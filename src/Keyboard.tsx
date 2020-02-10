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
              className="black"
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
          className="white"
          startOctave={startOctave}
          rangeSize={rangeSize}
          degrees={whiteNotes}
          keyStyleClass='white'
          extraDegreeCount={1}
          shift={whiteRowShift}
        />
      </AudioContextProvider>
      <div className="info-container">
        <div className="info">
          <p>Middle-Click: Hold the key</p>
          <p>Double-Click: Move key to the other row</p>
        </div>
      </div>
    </div>
  );
};
