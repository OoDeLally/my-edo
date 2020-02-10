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
  const inputNodes = useRef(new Set<GainNode>()).current;

  const masterGainNode = useMemo(
    () => {
      const node = audioContext.createGain();
      node.connect(audioContext.destination);
      node.gain.value = 0;
      return node;
    },
    [],
  );

  const updateMasterGain = useCallback(
    () => {
      console.log('inputNodes.size :', inputNodes.size);
      if (inputNodes.size === 0) {
        masterGainNode.gain.value = 0;
      } else {
        const inputSum = Array.from(inputNodes.values()).reduce((sum, node) => {
          console.log('node.gain.value :', node.gain.value);
          return sum + node.gain.value;
        }, 0);
        console.log('inputSum :', inputSum);
        masterGainNode.gain.value = MASTER_GAIN_FACTOR * inputSum;
      };
      console.log('masterGainNode.gain.value :', masterGainNode.gain.value);
    },
    [inputNodes, masterGainNode],
  );

  const connectGain = useCallback(
    (gainNode: GainNode) => {
      gainNode.connect(masterGainNode);
      inputNodes.add(gainNode);
      updateMasterGain();
      return () => {
        gainNode.disconnect();
        inputNodes.delete(gainNode);
      };
    },
    [inputNodes, updateMasterGain, masterGainNode],
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
