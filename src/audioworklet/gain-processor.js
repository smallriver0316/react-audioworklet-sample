class GainProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  static get parameterDescriptors() {
    return [
      {
        name: 'gain',
        defaultValue: '1',
        minValue: 0.0,
        maxValue: 1.0
      }
    ];
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
