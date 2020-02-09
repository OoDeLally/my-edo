import React from 'react';
import { EdoContextProvider } from './EdoContext';
import { Keyboard } from './Keyboard';

import './App.scss';
import { KeyboardSettingsPanel } from './KeyboardSettingsPanel';
import { KeyboardSettingsContextProvider, useKeyboardSettingsContext } from './KeyboardSettingsContext';



const KeyboardContainer = () => {
  const { startOctave, rangeInOctaves } = useKeyboardSettingsContext();
  return (
    <div className="keyboard-container">
      <KeyboardSettingsPanel />
      <Keyboard
        startOctave={startOctave}
        rangeInOctaves={rangeInOctaves}
      />
    </div>
  );
}


export default () => {
  return (
    <div className="App">
      <KeyboardSettingsContextProvider>
        <EdoContextProvider>
          <KeyboardContainer/>
        </EdoContextProvider>
      </KeyboardSettingsContextProvider>
    </div>
  );
}
