import React, { useEffect, useState } from 'react';
import { useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { NumberInput } from './NumberInput';




export const KeyboardSettingsPanel = () => {
  const { startOctave, rangeInOctaves, setStartOctave, setRangeInOctaves, } = useKeyboardSettingsContext();

  return (
    <div className="keyboard-settings-panel">
      <label>
        Starting octave:&nbsp;
        <NumberInput min={1} max={10} initialValue={startOctave} onChange={setStartOctave} />
      </label>
      <label>
        Tessitura (number of octaves):&nbsp;
        <NumberInput min={1} max={HIGHEST_OCTAVE_NUMBER - startOctave} initialValue={rangeInOctaves} onChange={setRangeInOctaves} />
      </label>
    </div>
  );
}
