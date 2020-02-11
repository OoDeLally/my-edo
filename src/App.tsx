import React from 'react';

import { Keyboard } from './Keyboard';
import { KeyboardSettingsContextProvider } from './KeyboardSettingsContext';
import { KeyboardSettingsPanel } from './KeyboardSettingsPanel';
import { ResetParamsButton } from './ResetParamsButton';
import { TetContextProvider, useTetContext } from './TetContext';
import { TetSystemSettingsPanel } from './TetSystemSettingsPanel';

import './App.scss';



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
      <ResetParamsButton />
    </div>
  );
};
