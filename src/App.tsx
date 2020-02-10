import React from 'react';
import { TetContextProvider, useTetContext } from './TetContext';
import { Keyboard } from './Keyboard';

import './App.scss';
import { KeyboardSettingsPanel } from './KeyboardSettingsPanel';
import { KeyboardSettingsContextProvider, useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { TetSystemSettingsPanel } from './TetSystemSettingsPanel';



const KeyboardContainer = () => {
  const { degreeCountPerOctave } = useTetContext();
  const { startOctave, rangeSize } = useKeyboardSettingsContext();
  return (
    <>
      <div className="keyboard-container">
        <h1>My {degreeCountPerOctave}-TET system</h1>
        <TetSystemSettingsPanel />
        <KeyboardSettingsPanel />
        {
          degreeCountPerOctave > 0 && (
            <Keyboard
              startOctave={startOctave}
              rangeInOctaves={rangeSize}
            />
          )
        }
        {
          degreeCountPerOctave === 0 && (
            <p>A {degreeCountPerOctave}-TET system is a bit boring, isn&apos;t it?</p>
          )
        }
      </div>
    </>
  );
};


export default () => {
  return (
    <div className="App">
      <TetContextProvider>
        <KeyboardSettingsContextProvider>
          <KeyboardContainer/>
        </KeyboardSettingsContextProvider>
      </TetContextProvider>
    </div>
  );
};
