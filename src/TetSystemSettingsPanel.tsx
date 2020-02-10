import React, { useCallback, useMemo, useRef } from 'react';
import { useTetContext } from './TetContext';
import { NumberInput } from './NumberInput';




export const TetSystemSettingsPanel = () => {
  const noteInputRef = useRef<HTMLInputElement>(null);
  const { notes, setNotes, degreeCountPerOctave, baseFrequency, setBaseFrequency } = useTetContext();
  const noteFieldValue = useMemo(() => notes.join(' '), [notes]);

  const handleNoteChange = useCallback(
    () => {
      setNotes(noteInputRef.current!.value.split(' ').filter(str => str));
    },
    [noteInputRef, setNotes],
  )

  return (
    <div className="tet-system-settings-panel">
      <label>
        My system notes:&nbsp;
        <input className="note-editor" type="text" defaultValue={noteFieldValue} onChange={handleNoteChange} ref={noteInputRef} />
      </label>
      {
        degreeCountPerOctave > 0 && (
          <p>
            My system starts at <b>ƒ( {notes[0]}0 ) =&nbsp;
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
