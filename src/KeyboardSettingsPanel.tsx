import React, { useMemo, useCallback, useRef } from 'react';
import { HIGHEST_OCTAVE_NUMBER, useKeyboardSettingsContext } from './KeyboardSettingsContext';
import { NumberInput } from './NumberInput';
import { useEdoContext } from './EdoContext';




export const KeyboardSettingsPanel = () => {
  const noteInputRef = useRef<HTMLInputElement>(null);
  const { degreeSizeInCents, notes, setNotes } = useEdoContext();
  const { startOctave, rangeInOctaves, setStartOctave, setRangeInOctaves, } = useKeyboardSettingsContext();

  const noteFieldValue = useMemo(() => notes.join(' '), [notes]);

  const handleNoteChange = useCallback(
    () => {
      const newNotes = noteInputRef.current!.value.split(' ').filter(str => str);
      setNotes(newNotes);
    },
    [noteInputRef, setNotes],
  )

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
      <label>
        Notes:&nbsp;
        <input className="note-editor" type="text" defaultValue={noteFieldValue} onChange={handleNoteChange} ref={noteInputRef} />
      </label>
      <div>Degree size: {degreeSizeInCents} cents</div>
    </div>
  );
}
