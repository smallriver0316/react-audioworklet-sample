import React, { useState } from 'react';
import { makeStyles, Card, CardActions, CardContent, Button, Typography, Slider } from '@material-ui/core';
import processor from '!!raw-loader!../audioworklet/noise-generator.js';

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
  const [, setGain] = useState(null);

  const startProcessing = () => {
    setProcessing(true);

    const context = new window.AudioContext();
    const blob = new Blob([processor], { type: 'application/javascript' });
    const blobURL = URL.createObjectURL(blob);
    context.audioWorklet.addModule(blobURL).then(() => {
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
    setProcessing(false);
    setOscillator(null);
    setGain(null);
  }

  const handleChange = (event, value) => {
    if (oscillator) {
      oscillator.frequency.value = value;
    }
    setFrequency(value);
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
            onChange={handleChange}
            aria-labelledby="frequency-slider"
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
