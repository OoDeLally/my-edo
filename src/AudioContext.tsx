import React, { ReactNode, useCallback, useContext, useMemo, useRef } from 'react';
import { useShallowMemoizedObject } from './hooks';


const MASTER_GAIN_FACTOR = 0.8;

const audioContext = new window.AudioContext();


type DisconnectGain = () => void;
type ConnectGain = (gainNode: GainNode) => DisconnectGain;


interface AudioContextProps {
  audioContext: AudioContext;
  connectGain: ConnectGain;
}


const AudioReactContext = React.createContext<AudioContextProps | null>(null);



export const useAudioContext = () =>
  useContext(AudioReactContext)!;


export const AudioContextProvider = ({ children }: AudioContextProviderProps) => {
  const connectionCountRef = useRef(0);

  const masterGainNode = useMemo(
    () => {
      const node = audioContext.createGain();
      node.connect(audioContext.destination);
      node.gain.value = MASTER_GAIN_FACTOR;
      return node;
    },
    [],
  );

  const updateMasterGain = useCallback(
    () => {
      masterGainNode.gain.value = MASTER_GAIN_FACTOR * (
        connectionCountRef.current > 0
        ? 1 / connectionCountRef.current
        : 1
      );
      console.log('masterGainNode.gain.value :', masterGainNode.gain.value);
    },
    [connectionCountRef, masterGainNode],
  );

  const connectGain = useCallback(
    (gainNode: GainNode) => {
      connectionCountRef.current++;
      // updateMasterGain();
      gainNode.connect(masterGainNode);
      return () => {
        gainNode.disconnect();
        connectionCountRef.current--;
      };
    },
    [connectionCountRef, updateMasterGain, masterGainNode],
  );

  const contextProps = useShallowMemoizedObject({
    audioContext,
    connectGain,
  });

  return (
    <AudioReactContext.Provider value={contextProps}>
      {children}
    </AudioReactContext.Provider>
  )
}


interface AudioContextProviderProps {
  children: ReactNode;
}
