import React from 'react';
import { EdoContextProvider } from './EdoContext';
import { Keyboard } from './Keyboard';

import './App.scss';


export default () => {
  return (
    <EdoContextProvider>
      <div className="App">
        <div className="keyboard-container">
          <Keyboard
            startOctave={3}
            rangeInOctaves={3}
          />
        </div>
      </div>
    </EdoContextProvider>
  );
}
