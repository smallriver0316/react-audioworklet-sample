/*
 * Create AudioWorklet module from text of AudioWorkletProcessor class
 * @param {string} processor - text of AudioWorkletProcessor class
 * @return {string} - text of Blob object URL
 */
export function createAudioWorkletModule(processor) {
    const blob = new Blob([processor], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}
