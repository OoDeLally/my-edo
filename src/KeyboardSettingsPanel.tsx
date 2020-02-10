import React, { useMemo, useCallback, useRef } from 'react';
import { HIGHEST_OCTAVE_NUMBER, useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { NumberInput } from './NumberInput';
import { useTetContext } from './TetContext';




export const KeyboardSettingsPanel = () => {
  const noteInputRef = useRef<HTMLInputElement>(null);
  const { notes, setNotes, degreeCountPerOctave } = useTetContext();
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
            <p>
              Show&nbsp;
              <NumberInput min={1} max={HIGHEST_OCTAVE_NUMBER - 1} initialValue={rangeInOctaves} onChange={setRangeInOctaves} />
              &nbsp;octaves starting from octave #
              <NumberInput min={1} max={HIGHEST_OCTAVE_NUMBER - 1} initialValue={startOctave} onChange={setStartOctave} />
              &nbsp; offsetted by &nbsp;
              <NumberInput min={1} max={1200} initialValue={startOctave} onChange={setStartOctave} />
              &nbsp; cents;
            </p>
          </>
        )
      }
    </div>
  );
}
