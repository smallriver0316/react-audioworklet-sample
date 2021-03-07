import React, { useState } from 'react';
import AudioPlayerCard from './AudioPlayerCard';
import { Typography, Slider } from '@material-ui/core';
import processor from '!!raw-loader!../audioworklet/noise-generator.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const ParamControlPattern = () => {
  const [context, setContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [frequency, setFrequency] = useState(0.25);
  const [gainNode, setGainNode] = useState(null);
  const [gain, setGain] = useState(0.5);

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
      setGainNode(gainNode);
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
    setGainNode(null);
    setContext(null);
  }

  const handleFrequencyChange = (event, value) => {
    if (oscillator) {
      oscillator.frequency.value = value;
    }
    setFrequency(value);
  }

  const handleGainChange = (event, value) => {
    if (gainNode) {
      gainNode.gain.value = value;
    }
    setGain(value);
  }

  return (
    <AudioPlayerCard
      title="Noise Controller"
      onStart={startProcessing}
      onStop={stopProcessing}
    >
      <p>
        Control user-defined parameters from AudioWorkletNode into AudioWorkletProcessor.
      </p>
      <div>
        <Typography id="frequency-slider" gutterBottom>Frequency</Typography>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={frequency}
          onChange={handleFrequencyChange}
          aria-labelledby="frequency-slider"
        />
      </div>
      <div>
        <Typography id="gain-slider" gutterBottom>Gain</Typography>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={handleGainChange}
          aria-labelledby="gain-slider"
        />
      </div>
    </AudioPlayerCard>
  );
}

export default ParamControlPattern;
