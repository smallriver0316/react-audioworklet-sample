import React, { useState } from 'react';
import AudioPlayerCard from './AudioPlayerCard';
import processor from '!!raw-loader!../audioworklet/bit-crusher.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const BitCrusher = () => {
  const [context, setContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);

  const startProcessing = async () => {
    const ctx = new window.AudioContext();
    const blobURL = createAudioWorkletModule(processor);
    await ctx.audioWorklet.addModule(blobURL).then(() => {
      const oscillatorNode = new OscillatorNode(ctx);
      const bitCrusher = new AudioWorkletNode(ctx, 'bit-crusher');
      const paramBitDepth = bitCrusher.parameters.get('bitDepth');
      const paramReduction = bitCrusher.parameters.get('frequencyReduction');

      oscillatorNode.type = 'sawtooth';
      oscillatorNode.frequency.value = 5000;
      paramBitDepth.setValueAtTime(1, 0);

      oscillatorNode.connect(bitCrusher).connect(ctx.destination);

      paramReduction.setValueAtTime(0.01, 0);
      paramReduction.linearRampToValueAtTime(0.1, 4);
      paramReduction.exponentialRampToValueAtTime(0.01, 8);

      oscillatorNode.start();
      oscillatorNode.stop(8);

      setOscillator(oscillatorNode);
    }).catch(err => {
      console.error(err);
    });
    setContext(ctx);
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
      title="Bit Crusher"
      onStart={startProcessing}
      onStop={stopProcessing}
    >
      <p>Demonstrate AudioParam automations.</p>
      <p>The sound source is a sawtooth oscillator at 5000Hz.</p>
      <p>The demo runs for 8 seconds.</p>
    </AudioPlayerCard>
  );
}

export default BitCrusher;
