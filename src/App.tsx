import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import './App.scss';

const CENTS_IN_OCTAVE = 1200;
const FREQUENCY_OFFSET = 16.35; // C0
const NOTE_NAMES = [
  // 'C', 'K', 'D', 'L', 'E', 'F', 'M', 'G', 'P', 'A', 'H', 'B',
  //
  // 'C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B',
  // Alphabetic:
  // 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  // Western:
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];
const DEGREE_COUNT = NOTE_NAMES.length;
const DEGREE_SIZE_IN_CENTS = CENTS_IN_OCTAVE / DEGREE_COUNT;

const INTERCENT_FACTOR = Math.pow(2, 1 / CENTS_IN_OCTAVE);


const getNoteName = (cents: number) => {
  const roundedCents = Math.round(cents);
  const octaveNum = Math.floor(roundedCents / CENTS_IN_OCTAVE);
  const degree = (roundedCents % CENTS_IN_OCTAVE) / DEGREE_SIZE_IN_CENTS;
  const note = NOTE_NAMES[Math.round(degree)];
  if (!note) {
    throw new Error(`Could not find name for degree ${degree}`)
  }
  return `${note}${octaveNum}`;
};

const parseNote = (note: string) => {
  const match = note.match(/^([A-Z#]+)([0-9]+)$/);
  if (!match) {
    throw new Error(`Could not parse note ${note}`);
  }
  const [, noteName, octaveNum] = match;
  const noteDegree = NOTE_NAMES.findIndex(v => v === noteName);
  if (noteDegree === -1) {
    throw new Error(`Could not find note name ${note}`);
  }
  return [noteName, +octaveNum, noteDegree] as const;
};


const getCent = (note: string) => {
  const [, octaveNum, noteDegree] = parseNote(note);
  return CENTS_IN_OCTAVE * octaveNum + noteDegree * DEGREE_SIZE_IN_CENTS;
};

const getFrequency = (note: string) => {
  return FREQUENCY_OFFSET * Math.pow(INTERCENT_FACTOR, getCent(note));
}



const audioContext = new window.AudioContext();


const NoteKey: React.FC<NoteKeyProps> = ({ note }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const gainNode = useMemo(
    () => {
      const node = audioContext.createGain();
      node.connect(audioContext.destination);
      node.gain.value = 0;
      return node;
    },
    [],
  );
  useEffect(
    () => {
      const osc = audioContext.createOscillator();
      osc.frequency.value = getFrequency(note);
      osc.connect(gainNode);
      osc.start();
    },
    [note, gainNode],
  );
  const start = useCallback(() => {
    audioContext.resume();
    gainNode.gain.setTargetAtTime(0.3, audioContext.currentTime, 0.05);
    setIsPlaying(true);
  }, [gainNode, setIsPlaying]);
  const stop = useCallback(() => {
    gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.05);
    setIsPlaying(false);
  }, [gainNode, setIsPlaying]);

  const noteLetter = useMemo(
    () => parseNote(note)[0],
    [note],
  );
  return (
    <button
      className={classNames('note-key', isPlaying && 'playing')}
      onMouseDown={start}
      onMouseOut={stop}
      onMouseUp={stop}
    >
      {noteLetter}
    </button>
  );
}

interface NoteKeyProps {
  note: string;
}



export default () => {
  const centCountOffset = CENTS_IN_OCTAVE * 3; // 3 octaves;
  const octaveCount = 5;

  const whiteNotes = [];
  {
    const end = centCountOffset + CENTS_IN_OCTAVE * octaveCount + 1;
    for (let cent = centCountOffset; cent < end; cent += 2 * DEGREE_SIZE_IN_CENTS) {
      whiteNotes.push(
        <NoteKey key={cent} note={getNoteName(cent)} />
      );
    }
  }
  const blackNotes = [];
  {
    const end = centCountOffset + CENTS_IN_OCTAVE * octaveCount;
    for (let cent = centCountOffset + DEGREE_SIZE_IN_CENTS; cent < end; cent += 2 * DEGREE_SIZE_IN_CENTS) {
      blackNotes.push(
        <NoteKey key={cent} note={getNoteName(cent)} />
      );
    }
  }

  return (
    <div className="App">
      <div className="black-row">
        { blackNotes }
      </div>
      <div className="white-row">
        { whiteNotes }
      </div>
    </div>
  );
}
