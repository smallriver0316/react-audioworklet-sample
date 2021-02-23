class MessengerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._lastUpdate = currentTime;
    this.port.onmessage = this.handleMessage_.bind(this);
  }

  handleMessage_(event) {
    console.log(`[MessengerProcessor:Receieved] ${event.data.message} (${event.data.contextTimestamp})`);
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
