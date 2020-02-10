import React, { ReactNode, useCallback, useContext, useMemo } from 'react';
import { useShallowMemoizedObject } from './hooks';


const audioContext = new window.AudioContext();


type DisconnectAudioNode = () => void;
type ConnectAudioNode = (audioNode: AudioNode) => DisconnectAudioNode;


interface AudioContextProps {
  audioContext: AudioContext;
  connectNode: ConnectAudioNode;
}


const AudioReactContext = React.createContext<AudioContextProps | null>(null);



export const useAudioContext = () =>
  useContext(AudioReactContext)!;


export const AudioContextProvider = ({ children }: AudioContextProviderProps) => {

  const compressorNode = useMemo(
    () => {
      const node = audioContext.createDynamicsCompressor();
      node.connect(audioContext.destination);
      return node;
    },
    [],
  );

  const connectNode = useCallback(
    (audioNode: AudioNode) => {
      audioNode.connect(compressorNode);
      return () => {
        audioNode.disconnect();
      };
    },
    [compressorNode],
  );

  const contextProps = useShallowMemoizedObject({
    audioContext,
    connectNode,
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
