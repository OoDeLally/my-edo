import React from 'react';

import { Keyboard } from './Keyboard';
import { KeyboardSettingsContextProvider } from './KeyboardSettingsContext';
import { KeyboardSettingsPanel } from './KeyboardSettingsPanel';
import { ResetParamsButton } from './ResetParamsButton';
import { EtContextProvider, useEtContext } from './EtContext';
import { EtSystemSettingsPanel } from './EtSystemSettingsPanel';

import './App.scss';



const KeyboardContainer = () => {
  const { degreeCountPerOctave } = useEtContext();
  return (
    <>
      <div className="keyboard-container">
        <h1>
          My {degreeCountPerOctave}-ET system
          <ResetParamsButton />
        </h1>
        <EtSystemSettingsPanel />
        <KeyboardSettingsPanel />
        {
          degreeCountPerOctave > 0 && (
            <Keyboard/>
          )
        }
        {
          degreeCountPerOctave === 0 && (
            <p>A {degreeCountPerOctave}-ET system is a bit boring, isn&apos;t it?</p>
          )
        }
      </div>
    </>
  );
};



export default () => {
  return (
    <div className="app">
      <EtContextProvider>
        <KeyboardSettingsContextProvider>
          <KeyboardContainer/>
        </KeyboardSettingsContextProvider>
      </EtContextProvider>
    </div>
  );
};
