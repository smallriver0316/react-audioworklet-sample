class BitCrusherProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'bitDepth',
        defaultValue: 12,
        minValue: 1,
        maxValue: 16
      },
      {
        name: 'frequencyReduction',
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1
      }
      ];
  }

  constructor() {
    super();
    this.phase_ = 0;
    this.lastSampleValue_ = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    // AudioParam array can be either length of 1 or 128.
    const bitDepth = parameters.bitDepth;
    const frequencyReduction = parameters.frequencyReduction;
    const isBitDepthConstant = bitDepth.length === 1;

    for (let ch = 0; ch < input.length; ++ch) {
      const inputCh = input[ch];
      const outputCh = output[ch];
      let step = Math.pow(0.5, bitDepth[0]);
    
      for (let i = 0; i < inputCh.length; ++i) {
        if (!isBitDepthConstant) {
          step = Math.pow(0.5, bitDepth[i]);
        }
        this.phase_ += frequencyReduction[i];

        if (this.phase_ >= 1.0) {
          this.phase_ -= 1.0;
          this.lastSampleValue_ = step * Math.floor(inputCh[i] / step + 0.5);
        }
        outputCh[i] = this.lastSampleValue_;
      }
    }
    return true;
  }
}

registerProcessor('bit-crusher', BitCrusherProcessor);
