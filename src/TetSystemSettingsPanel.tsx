import React, { useCallback, useMemo, useRef, useEffect } from 'react';

import { NumberInput } from './NumberInput';
import { useTetContext } from './TetContext';
import { uniq, isEqual } from 'lodash';
import { useDebounce } from './hooks';


const notesFieldValueToNotes = (inputStr: string) =>
  uniq(inputStr.split(' ').filter(str => str));


export const TetSystemSettingsPanel = () => {
  const noteInputRef = useRef<HTMLInputElement>(null);
  const { notes, setNotes, degreeCountPerOctave, baseFrequency, setBaseFrequency, degreeSizeInCents } = useTetContext();
  const noteFieldValue = useMemo(() => notes.join(' '), [notes]);
  const noteEditDebounce = useDebounce(300);

  const getNotesFromInput = useCallback(
    () => notesFieldValueToNotes(noteInputRef.current!.value),
    [],
  );

  const handleNoteChange = useCallback(
    () => {
      noteEditDebounce(
        () => setNotes(getNotesFromInput())
      );
    },
    [getNotesFromInput, setNotes, noteEditDebounce],
  );

  useEffect(() => {
    if (!isEqual(notes, getNotesFromInput())) {
      noteInputRef.current!.value = notes.join(' ');
    }
  }, [notes, getNotesFromInput]);

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
};
