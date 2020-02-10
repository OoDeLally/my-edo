import React from 'react';
import { HIGHEST_OCTAVE_NUMBER, useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { NumberInput } from './NumberInput';
import { useTetContext } from './TetContext';




export const KeyboardSettingsPanel = () => {
  const { degreeCountPerOctave } = useTetContext();
  const {
    startOctave, rangeSize,
    setStartOctave, setRangeInOctaves,
  } = useKeyboardSettingsContext();


  return (
    <div className="keyboard-settings-panel">
      {
        degreeCountPerOctave > 0 && (
          <>
            <p>
              Show&nbsp;
              <NumberInput
                enableManualEdit={false}
                min={1}
                max={HIGHEST_OCTAVE_NUMBER - 1}
                initialValue={rangeSize}
                onChange={setRangeInOctaves}
              />
              &nbsp;octaves starting from octave #
              <NumberInput
                enableManualEdit={false}
                min={1}
                max={HIGHEST_OCTAVE_NUMBER - 1}
                initialValue={startOctave}
                onChange={setStartOctave}
              />.
            </p>
          </>
        )
      }
    </div>
  );
};
