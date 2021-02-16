import React, { useState } from 'react';
import { makeStyles, Card, CardActions, CardContent, Button, Typography } from "@material-ui/core";
import processor from '!!raw-loader!../audioworklet/gain-processor.js';

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

const BasicPattern = () => {
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
          Basic Pattern 1
        </Typography>
        <p>
          AudioWorklet basic implement pattern.
        </p>
        <p>
          Import AudioWorkletProcessor as text with raw-loader.
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

export default BasicPattern;
