import React, { useState } from 'react';
import AudioPlayerCard from './AudioPlayerCard';
import processor from '!!raw-loader!../audioworklet/messenger-processor.js';
import { createAudioWorkletModule } from '../utils/createAudioWorkletModule';

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
  const [context, setContext] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleMessageBuffer = (msg) => {
    if (messages.length > 5) {
      messages.shift();
    }
    setMessages([...new Set(messages), msg]);
  };

  const startProcessing = async () => {
    const context = new window.AudioContext();
    const blobURL = createAudioWorkletModule(processor);
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
    setContext(null);
    setMessages([]);
  }

  return (
    <AudioPlayerCard
      title="Message Port"
      onStart={startProcessing}
      onStop={stopProcessing}
    >
      {messages.map((msg, idx) => {
        return (<p key={idx}>{msg}</p>);
      })}
    </AudioPlayerCard>
  );
}

export default MessagePort;
