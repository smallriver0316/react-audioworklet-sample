import React, { useState } from 'react';
// import { Typography, Slider } from '@material-ui/core';
import AudioPlayerCard from './AudioPlayerCard';
import processor from '!!raw-loader!../audioworklet/gain-processor.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const ContentPlayer = () => {
  const [context, setContext] = useState(null);
  const [source, setSource] = useState(null);
  // const [gainNode, setGainNode] = useState(null);
  // const [gainValue, setGainValue] = useState(1.0);

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

    const blobURL = createAudioWorkletModule(processor);
    await ctx.audioWorklet.addModule(blobURL).then(() => {
      const audioWorklet = new AudioWorkletNode(ctx, 'gain-processor');

      source.connect(audioWorklet).connect(ctx.destination);

      // const gainParam = audioWorklet.parameters.get('gain');
      // const gainNode = new GainNode(ctx);
      // source.connect(gainNode).connect(gainParam);
      // gainNode.gain.value = 1.0;

      source.start();
      // setGainNode(gainNode);
    }).catch(err => {
      console.error(err);
    });

    setContext(ctx);
    setSource(source);
  };

  const stopProcessing = () => {
    if (source) {
      source.stop();
      source.disconnect();
    }
    // if (gainNode) {
    //   gainNode.disconnect();
    // }
    if (context) {
      context.close();
    }
    setSource(null);
    // setGainNode(null);
    setContext(null);
  };

  // const handleGainChange = (event, value) => {
  //   if (gainNode) {
  //     gainNode.gain.value = value;
  //   }
  //   setGainValue(value);
  // }

  return (
    <AudioPlayerCard
      title="Music Player"
      onStart={startProcessing}
      onStop={stopProcessing}
    >
      <p>Play local audio file</p>
      {/* <div>
        <Typography id="gain-slider" gutterBottom>Gain</Typography>
        <Slider
          min={0}
          max={1.0}
          step={0.01}
          value={gainValue}
          onChange={handleGainChange}
          aria-labelledby="gain-slider"
        />
      </div> */}
    </AudioPlayerCard>
  );
};

export default ContentPlayer;
