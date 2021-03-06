import React, { useState } from 'react';
import { makeStyles, Card, CardActions, CardContent, Button, Typography, Slider } from '@material-ui/core';
import processor from '!!raw-loader!../audioworklet/noise-generator.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

const useStyles = makeStyles({
  root: {
    width: 256,
    margin: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
  }
});

const ParamControlPattern = () => {
const classes = useStyles();
  const [context, setContext] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [oscillator, setOscillator] = useState(null);
  const [frequency, setFrequency] = useState(0.25);
  const [gainNode, setGainNode] = useState(null);
  const [gain, setGain] = useState(0.5);

  const startProcessing = async () => {
    setProcessing(true);

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
    setProcessing(false);
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
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Noise Controller
        </Typography>
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
      </CardContent>
      <CardActions>
        <Button
          key="play"
          color="primary"
          disabled={processing}
          onClick={() => startProcessing()}
        >
          Play
        </Button>
        <Button
          key="stop"
          color="secondary"
          disabled={!processing}
          onClick={() => stopProcessing()}
        >
          Stop
        </Button>
      </CardActions>
    </Card>
  );
}

export default ParamControlPattern;
