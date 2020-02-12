import React, { useCallback } from 'react';

import { useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { useTetContext } from './TetContext';



export const ResetParamsButton = () => {
  const { touched: tetTouched, reset: resetTet } = useTetContext();
  const { touched: keyboardTouched, reset: resetKeyboard } = useKeyboardSettingsContext();

  const reset = useCallback(
    () => {
      resetTet();
      resetKeyboard();
    },
    [resetTet, resetKeyboard],
  );

  if (!tetTouched && !keyboardTouched) {
    return null;
  }

  return (
    <button onClick={reset}>Reset</button>
  );
};
