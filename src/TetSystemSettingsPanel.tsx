import React, { useCallback, useMemo, useRef } from 'react';
import { useTetContext } from './TetContext';
import { NumberInput } from './NumberInput';




export const TetSystemSettingsPanel = () => {
  const noteInputRef = useRef<HTMLInputElement>(null);
  const { notes, setNotes, degreeCountPerOctave, baseFrequency, setBaseFrequency, degreeSizeInCents } = useTetContext();
  const noteFieldValue = useMemo(() => notes.join(' '), [notes]);

  const handleNoteChange = useCallback(
    () => {
      setNotes(noteInputRef.current!.value.split(' ').filter(str => str));
    },
    [noteInputRef, setNotes],
  )

  return (
    <div className="tet-system-settings-panel">
      <p>My notes are named</p>

      <p>
        <input className="note-editor" type="text" defaultValue={noteFieldValue} onChange={handleNoteChange} ref=
        {noteInputRef} />
      </p>
      {
        degreeCountPerOctave > 0 && (
          <p>
            <b>{Math.round(degreeSizeInCents * 10) / 10} cents / degree</b>
            &nbsp;
            starting at <b>ƒ( {notes[0]}0 ) =&nbsp;
            <NumberInput
              type="text"
              className="base-frequency"
              min={10}
              initialValue={baseFrequency}
              onBlur={setBaseFrequency}
            />
            &nbsp;Hz</b>.
          </p>
        )
      }
    </div>
  );
}
