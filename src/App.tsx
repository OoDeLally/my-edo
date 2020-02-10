import React from 'react';
import { TetContextProvider, useTetContext } from './TetContext';
import { Keyboard } from './Keyboard';

import './App.scss';
import { KeyboardSettingsPanel } from './KeyboardSettingsPanel';
import { KeyboardSettingsContextProvider } from './KeyboardSettingsContext';
import { TetSystemSettingsPanel } from './TetSystemSettingsPanel';



const KeyboardContainer = () => {
  const { degreeCountPerOctave } = useTetContext();
  return (
    <>
      <div className="keyboard-container">
        <h1>My {degreeCountPerOctave}-TET system</h1>
        <TetSystemSettingsPanel />
        <KeyboardSettingsPanel />
        {
          degreeCountPerOctave > 0 && (
            <Keyboard/>
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
