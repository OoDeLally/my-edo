import React, { useCallback } from 'react';

import { useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { useEtContext } from './EtContext';



export const ResetParamsButton = () => {
  const { reset: resetEt } = useEtContext();
  const { reset: resetKeyboard } = useKeyboardSettingsContext();

  const reset = useCallback(
    () => {
      resetEt();
      resetKeyboard();
    },
    [resetEt, resetKeyboard],
  );

  return (
    <button className="reset" onClick={reset}>↺</button>
  );
};
