import React from 'react';
import { HIGHEST_OCTAVE_NUMBER, useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { NumberInput } from './NumberInput';




export const KeyboardSettingsPanel = () => {
  const { startOctave, rangeInOctaves, setStartOctave, setRangeInOctaves, } = useKeyboardSettingsContext();

  return (
    <div className="keyboard-settings-panel">
      <label>
        Starting octave:&nbsp;
        <NumberInput min={2} max={HIGHEST_OCTAVE_NUMBER - 1} initialValue={startOctave} onChange={setStartOctave} />
      </label>
      <label>
        Tessitura (number of octaves):&nbsp;
        <NumberInput min={1} max={HIGHEST_OCTAVE_NUMBER - 1} initialValue={rangeInOctaves} onChange={setRangeInOctaves} />
      </label>
    </div>
  );
}
