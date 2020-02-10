import React from 'react';
import { TetContextProvider, useTetContext } from './TetContext';
import { Keyboard } from './Keyboard';

import './App.scss';
import { KeyboardSettingsPanel } from './KeyboardSettingsPanel';
import { KeyboardSettingsContextProvider, useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { TetSystemSettingsPanel } from './TetSystemSettingsPanel';



const KeyboardContainer = () => {
  const { degreeCountPerOctave, degreeSizeInCents } = useTetContext();
  const { startOctave, rangeSize } = useKeyboardSettingsContext();
  return (
    <>
      <div className="keyboard-container">
        <h1>My {degreeCountPerOctave}-TET system</h1>
        {
          degreeCountPerOctave > 0 && (
          <div>({Math.round(degreeSizeInCents * 10) / 10} cents / degree)</div>
          )
        }
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
            <p>A {degreeCountPerOctave}-TET system is a bit boring, isn't it?</p>
          )
        }
      </div>
    </>
  );
}


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
}
