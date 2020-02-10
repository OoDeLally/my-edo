import React from 'react';
import { EdoContextProvider, useEdoContext } from './EdoContext';
import { Keyboard } from './Keyboard';

import './App.scss';
import { KeyboardSettingsPanel } from './KeyboardSettingsPanel';
import { KeyboardSettingsContextProvider, useKeyboardSettingsContext } from './KeyboardSettingsContext';



const KeyboardContainer = () => {
  const { degreeCountPerOctave } = useEdoContext();
  const { startOctave, rangeInOctaves } = useKeyboardSettingsContext();
  return (
    <>
      <div className="keyboard-container">
        <h1>My {degreeCountPerOctave}-TET keyboard</h1>
        <KeyboardSettingsPanel />
        <Keyboard
          startOctave={startOctave}
          rangeInOctaves={rangeInOctaves}
        />
        <p>Middle-Click: Hold the key</p>
      </div>
    </>
  );
}


export default () => {
  return (
    <div className="App">
      <EdoContextProvider>
        <KeyboardSettingsContextProvider>
          <KeyboardContainer/>
        </KeyboardSettingsContextProvider>
      </EdoContextProvider>
    </div>
  );
}
