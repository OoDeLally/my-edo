import React, { useCallback } from 'react';

import { AudioContextProvider } from './AudioContext';
import { KeyboardKeyRow } from './KeyboardKeyRow';
import { useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { useTetContext } from './TetContext';

import './Keyboard.scss';




export const Keyboard = () => {
  const { notes } = useTetContext();
  const { layout: [whiteNotes, blackNotes], startOctave, rangeSize } = useKeyboardSettingsContext();
  const firstNote = notes[0];
  const whiteRowShift = whiteNotes.includes(firstNote) ? 0 : 1;
  const blackRowShift = blackNotes.includes(firstNote) ? 0 : 1;

  const preventEvent = useCallback((event: React.MouseEvent) => { event.preventDefault(); }, []);

  return (
    <div className="keyboard" onContextMenu={preventEvent}>
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
          <img className="icon" alt="Left-Click" src="img/left-mouse.png" /> Play a note
        </div>
        <div className="info">
          <img className="icon" alt="Middle-Click" src="img/middle-mouse.png" />Hold a note
        </div>
        <div className="info">
          <img className="icon" alt="Right-Click" src="img/right-mouse.png" />Move key to the other row
        </div>
      </div>
    </div>
  );
};
