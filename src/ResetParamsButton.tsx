import React, { useCallback } from 'react';

import { useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { useTetContext } from './TetContext';



export const ResetParamsButton = () => {
  const { reset: resetTet } = useTetContext();
  const { reset: resetKeyboard } = useKeyboardSettingsContext();

  const reset = useCallback(
    () => {
      resetTet();
      resetKeyboard();
    },
    [resetTet, resetKeyboard],
  );

  return (
    <button className="reset" onClick={reset}>↺</button>
  );
};
