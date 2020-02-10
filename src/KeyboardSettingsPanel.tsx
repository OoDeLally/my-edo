import React, { useMemo, useCallback, useRef } from 'react';
import { HIGHEST_OCTAVE_NUMBER, useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { NumberInput } from './NumberInput';
import { useEdoContext } from './EdoContext';




export const KeyboardSettingsPanel = () => {
  const noteInputRef = useRef<HTMLInputElement>(null);
  const { notes, setNotes, degreeCountPerOctave } = useEdoContext();
  const { startOctave, rangeInOctaves, setStartOctave, setRangeInOctaves, } = useKeyboardSettingsContext();

  const noteFieldValue = useMemo(() => notes.join(' '), [notes]);

  const handleNoteChange = useCallback(
    () => {
      setNotes(noteInputRef.current!.value.split(' ').filter(str => str));
    },
    [noteInputRef, setNotes],
  )

  return (
    <div className="keyboard-settings-panel">
      <label>
        Add / Remove notes to modify the TET system:&nbsp;
        <input className="note-editor" type="text" defaultValue={noteFieldValue} onChange={handleNoteChange} ref={noteInputRef} />
      </label>
      {
        degreeCountPerOctave > 0 && (
          <>
            <label>
              Starting octave:&nbsp;
              <NumberInput min={2} max={HIGHEST_OCTAVE_NUMBER - 1} initialValue={startOctave} onChange={setStartOctave} />
            </label>
            <label>
              Tessitura (number of octaves):&nbsp;
              <NumberInput min={1} max={HIGHEST_OCTAVE_NUMBER - 1} initialValue={rangeInOctaves} onChange={setRangeInOctaves} />
            </label>
          </>
        )
      }
    </div>
  );
}
