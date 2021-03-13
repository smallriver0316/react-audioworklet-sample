import React, { useState } from 'react';
import AudioPlayerCard from './AudioPlayerCard';
import processor from '!!raw-loader!../audioworklet/one-pole-processor.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const OnePoleFilter = () => {
  const [context, setContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);

  const startProcessing = async () => {
    const ctx = new window.AudioContext();
    const blobURL = createAudioWorkletModule(processor);
    await ctx.audioWorklet.addModule(blobURL).then(() => {
      const oscillatorNode = new OscillatorNode(ctx);
      const filter = new AudioWorkletNode(ctx, 'one-pole-processor');
      const frequencyParam = filter.parameters.get('frequency');

      oscillatorNode.connect(filter).connect(ctx.destination);
      oscillatorNode.start();

      frequencyParam
        .setValueAtTime(0.01, 0)
        .exponentialRampToValueAtTime(ctx.sampleRate * 0.5, 4.0)
        .exponentialRampToValueAtTime(0.01, 8.0);

      setOscillator(oscillatorNode);
      setContext(ctx);
    }).catch(err => {
      console.error(err);
    });
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
      title="One Pile Filter"
      onStart={startProcessing}
      onStop={stopProcessing}
    />
  );
};

export default OnePoleFilter;
