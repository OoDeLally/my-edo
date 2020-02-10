import React from 'react';
import { AudioContextProvider } from './AudioContext';
import { useKeyMap } from './hooks';

import { KeyboardKeyRow } from './KeyboardKeyRow';
import { useKeyboardSettingsContext } from './KeyboardSettingsContext';

import './Keyboard.scss';



export const Keyboard = () => {
  const { rowSettings, startOctave, rangeSize } = useKeyboardSettingsContext();
  const keyMap = useKeyMap(rowSettings);

  const whiteRowSettings = rowSettings[0];
  const blackRowSettings = rowSettings[1];

  return (
    <div className="keyboard">
      <AudioContextProvider>
        {
          blackRowSettings && (
            <>
              <div key="start-half-sep" className="key-half-separator">&nbsp;</div>
              <KeyboardKeyRow
                key={keyMap.get(blackRowSettings)}
                startOctave={startOctave}
                rangeSize={rangeSize}
                degrees={blackRowSettings.notes}
                keyStyleClass='black'
                extraDegreeCount={0}
              />
            </>
          )
        }
        <KeyboardKeyRow
          key={keyMap.get(whiteRowSettings)}
          startOctave={startOctave}
          rangeSize={rangeSize}
          degrees={whiteRowSettings.notes}
          keyStyleClass='white'
          extraDegreeCount={1}
        />
      </AudioContextProvider>
      <p className="info">( Middle-Click: Hold the key )</p>
    </div>
  );
};
