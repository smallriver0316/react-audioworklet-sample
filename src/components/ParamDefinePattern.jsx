import React, { useState } from 'react';
import AudioPlayerCard from './AudioPlayerCard';
import processor from '!!raw-loader!../audioworklet/noise-generator.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const ParamDefinePattern = () => {
  const [context, setContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [, setGain] = useState(null);

  const startProcessing = async () => {
    const context = new window.AudioContext();
    const blobURL = createAudioWorkletModule(processor);
    await context.audioWorklet.addModule(blobURL).then(() => {
      const oscillatorNode = new OscillatorNode(context);
      const gainNode = new GainNode(context);
      const noiseGenerator = new AudioWorkletNode(context, 'noise-generator');
      noiseGenerator.connect(context.destination);

      const paramAmp = noiseGenerator.parameters.get('amplitude');
      oscillatorNode.connect(gainNode).connect(paramAmp);

      oscillatorNode.frequency.value = 0.25;
      gainNode.gain.value = 0.5;
      oscillatorNode.start();
      setOscillator(oscillatorNode);
      setGain(gainNode);
    }).catch(err => {
      console.error(err);
    });
    setContext(context);
  }

  const stopProcessing = () => {
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
    }
    if (context) {
      context.close();
    }
    setOscillator(null);
    setGain(null);
    setContext(null);
  }

  return (
    <AudioPlayerCard
      title="Noise Generator"
      subTitle={
        <p>
          Set user-defined parameters from AudioWorkletNode into AudioWorkletProcessor.
        </p>
      }
      onStart={startProcessing}
      onStop={stopProcessing}
    />
  );
}

export default ParamDefinePattern;
