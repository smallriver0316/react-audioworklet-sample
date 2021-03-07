import React, { useState } from 'react';
import AudioPlayerCard from './AudioPlayerCard';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';


const processor = `
class GainProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  static get parameterDescriptors() {
    return [{
      name: 'gain',
      defaultValue: '1'
    }];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const gain = parameters.gain;

    for (let ch = 0; ch < input.length; ch++) {
      const inputChannel = input[ch];
      const outputChannel = output[ch];
      if (gain.length === 1) {
        for (let i = 0; i < inputChannel.length; ++i) {
          outputChannel[i] = inputChannel[i] * gain[0];
        }
      } else {
        for (let i = 0; i < inputChannel.length; ++i) {
          outputChannel[i] = inputChannel[i] * gain[i];
        }
      }
    }
    return true;
  }
}

registerProcessor('gain-processor', GainProcessor);
`;

const TextDefinePattern = () => {
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
      title="Basic Pattern 2"
      onStart={startProcessing}
      onStop={stopProcessing}
    >
      <p>
        Define AudioWorkletProcessor as text string.
      </p>
    </AudioPlayerCard>
  );
}

export default TextDefinePattern;
