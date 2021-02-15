class NoiseGenerator extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  static get parameterDescriptors() {
    return [{
      name: 'amplitude',
      defaultValue: 0.25,
      minValue: 0,
      maxValue: 1
    }];
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const amplitude = parameters.amplitude;

    for (let ch = 0; ch < output.length; ch++) {
      const outputChannel = output[ch];
      for (let i = 0; i < outputChannel.length; ++i) {
        if (amplitude.length === 1) {
          outputChannel[i] = 2 * (Math.random() - 0.5) * amplitude[0];
        } else {
          outputChannel[i] = 2 * (Math.random() - 0.5) * amplitude[i];
        }
      }
    }
    return true;
  }
}

registerProcessor('noise-generator', NoiseGenerator);
