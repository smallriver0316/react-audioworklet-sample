import React, { useState } from 'react';
import AudioPlayerCard from './AudioPlayerCard';
import processor from '!!raw-loader!../audioworklet/gain-processor.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const BasicPattern = () => {
  const [context, setContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);

  const startProcessing = async () => {
    const context = new window.AudioContext();
    const blobURL = createAudioWorkletModule(processor);
    await context.audioWorklet.addModule(blobURL).then(() => {
      const oscillatorNode = new OscillatorNode(context);
      const gainWorkletNode = new AudioWorkletNode(context, 'gain-processor');
      oscillatorNode.connect(gainWorkletNode).connect(context.destination);
      oscillatorNode.start();
      setOscillator(oscillatorNode);
    }).catch(err => {
      console.error(err);
    });
    setContext(context);
  };

  const stopProcessing = () => {
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
    }
    if (context) {
      context.close();
    }
    setOscillator(null);
    setContext(null);
  };

  return (
    <AudioPlayerCard
      title="Basic Pattern 1"
      subTitle={
        <div>
          <p>
            AudioWorklet basic implement pattern.
          </p>
          <p>
            Import AudioWorkletProcessor as text with raw-loader.
          </p>
        </div>
      }
      onStart={startProcessing}
      onStop={stopProcessing}
    />
  );
}

export default BasicPattern;
