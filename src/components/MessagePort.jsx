import React, { useState } from 'react';
import { makeStyles, Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
// import processor from '!!raw-loader!../audioworklet/messenger-processor.js';

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
class MessengerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._lastUpdate = currentTime;
    this.port.onmessage = this.handleMessage_.bind(this);
  }

  handleMessage_(event) {
    console.log('[MessengerProcessor:Receieved]' + event.data.message + '(' + event.data.contextTimestamp + ')');
  }

  process() {
    if (currentTime - this._lastUpdate > 1.0) {
      this.port.postMessage({
        message: '1 second passed',
        contextTimestamp: currentTime
      });
      this._lastUpdate = currentTime;
    }
    return true;
  }
}

registerProcessor('messenger-processor', MessengerProcessor);
`;

class MessengerWorkletNode extends AudioWorkletNode {
  constructor(context, logger) {
    super(context, 'messenger-processor');
    this.counter_ = 0;
    this.port.onmessage = this.handleMessage_.bind(this);
    this.logger = logger;
    this.logger('Open console to see messages from the processor');
  }

  handleMessage_(event) {
    this.logger(`[Node:handleMessage_] ${event.data.message} (${event.data.contextTimestamp})`);
    if (this.counter_++ === 10) {
      this.port.postMessage({
        message: '10 messages received!',
        contextTimestamp: this.context.currentTime
      });
      this.counter_ = 0;
    }
  }
}

const MessagePort = () => {
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);
  const [context, setContext] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleMessageBuffer = (msg) => {
    if (messages.length > 5) {
      messages.shift();
    }
    setMessages([...new Set(messages), msg]);
  };

  const startProcessing = async () => {
    setProcessing(true);

    const context = new window.AudioContext();
    const blob = new Blob([processor], { type: 'application/javascript' });
    const blobURL = URL.createObjectURL(blob);
    await context.audioWorklet.addModule(blobURL).then(() => {
      const messengerWorkletNode = new MessengerWorkletNode(context, handleMessageBuffer);
      messengerWorkletNode.connect(context.destination);
    }).catch(err => {
      console.error(err);
    });
    setContext(context);
  };

  const stopProcessing = () => {
    if (context) {
      context.close();
    }
    setProcessing(false);
    setContext(null);
    setMessages([]);
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          MessagePort
        </Typography>
        <div>
          {messages.map((msg, idx) => {
            return (<p key={idx}>{msg}</p>);
          })}
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

export default MessagePort;
