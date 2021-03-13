/* eslint-disable no-undef */
class OnePoleProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: 'frequency',
      defaultValue: 250,
      minValue: 0,
      maxValue: 0.5 * sampleRate
    }];
  }

  constructor() {
    super();
    this.updateCoefficientWithFrequency_(250);
  }

  updateCoefficientWithFrequency_(frequency) {
    this.b1_ = Math.exp(-2 * Math.PI * frequency / sampleRate);
    this.a0_ = 1.0 - this.b1_;
    this.z1_ = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    const frequency = parameters.frequency;
    const isFrequencyConstant = frequency.length === 1;

    for (let ch = 0; ch < input.length; ++ch) {
      const inputCh = input[ch];
      const outputCh = output[ch];

      if (isFrequencyConstant) {
        this.updateCoefficientWithFrequency_(frequency[0]);
      }

      for (let i = 0; i < inputCh.length; ++i) {
        if (!isFrequencyConstant) {
          this.updateCoefficientWithFrequency_(frequency[i]);
        }
        this.z1_ = inputCh[i] * this.a0_ + this.z1_ * this.b1_;
        outputCh[i] = this.z1_;
      }
    }
    return true;
  }
}

registerProcessor('one-pole-processor', OnePoleProcessor);
