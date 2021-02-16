import React, { useState } from 'react';
import { makeStyles, Card, CardActions, CardContent, Button, Typography } from "@material-ui/core";

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
  const classes = useStyles();
  const [context, setContext] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [oscillator, setOscillator] = useState(null);

  const startProcessing = () => {
    setProcessing(true);

    const context = new window.AudioContext();
    const blob = new Blob([processor], { type: 'application/javascript' });
    const blobURL = URL.createObjectURL(blob);
    context.audioWorklet.addModule(blobURL).then(() => {
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
    setProcessing(false);
    setOscillator(null);
    setContext(null);
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Basic Pattern 2
        </Typography>
        <p>
          Define AudioWorkletProcessor as text string.
        </p>
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

export default TextDefinePattern;
