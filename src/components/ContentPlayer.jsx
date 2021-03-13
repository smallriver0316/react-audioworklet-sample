import React, { useState } from 'react';
import { Typography, Slider } from '@material-ui/core';
import AudioPlayerCard from './AudioPlayerCard';
// import processor from '!!raw-loader!../audioworklet/gain-processor.js';
// import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const ContentPlayer = () => {
  const [context, setContext] = useState(null);
  const [source, setSource] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [gainValue, setGainValue] = useState(0.5);

  const startProcessing = async () => {
    const ctx = new window.AudioContext();
    const source = ctx.createBufferSource();

    const request = new Request('sample.mp3');
    const res = await fetch(request).catch(err => {
        console.error('fetch audio data failed');
        console.error(err);
    });
    const arrayBuffer = await res.arrayBuffer();
    const buffer = await ctx.decodeAudioData(arrayBuffer, (buf) => buf, (err) => {
        console.error('decodeAudioData failed');
        console.error(err);
    });
    source.buffer = buffer;
    source.loop = true;

    const gainNode = new GainNode(ctx);
    source.connect(gainNode).connect(ctx.destination);
    source.start();

    // const blobURL = createAudioWorkletModule(processor);
    // await ctx.audioWorklet.addModule(blobURL).then(() => {
    //   const gainProcessor = new AudioWorkletNode(ctx, 'gain-processor');
    //   const gainNode = new GainNode(ctx);

    //   source.connect(gainNode).connect(ctx.destination);
    //   source.start();

    //   const gainParam = gainProcessor.parameters.get('gain');
    //   gainNode.connect(gainParam);
    //   setGainNode(gainNode);
    // }).catch(err => {
    //   console.error(err);
    // });
    gainNode.gain.value = 0.5;
    setContext(ctx);
    setSource(source);
    setGainNode(gainNode);
  };

  const stopProcessing = () => {
    if (source) {
      source.stop();
      source.disconnect();
    }
    if (gainNode) {
      gainNode.disconnect();
    }
    if (context) {
      context.close();
    }
    setSource(null);
    setGainNode(null);
    setContext(null);
  };

  const handleGainChange = (event, value) => {
    if (gainNode) {
      gainNode.gain.value = value;
    }
    setGainValue(value);
  }

  return (
    <AudioPlayerCard
      title="Music Player"
      onStart={startProcessing}
      onStop={stopProcessing}
    >
      <p>Play local MP3 data as public/sample.mp3.</p>
      <p>Gain control is achieved with GainNode.</p>
      <p>Loop playback is enabled.</p>
      <div>
        <Typography id="gain-slider" gutterBottom>Gain</Typography>
        <Slider
          min={0}
          max={1.0}
          step={0.01}
          value={gainValue}
          onChange={handleGainChange}
          aria-labelledby="gain-slider"
        />
      </div>
    </AudioPlayerCard>
  );
};

export default ContentPlayer;
