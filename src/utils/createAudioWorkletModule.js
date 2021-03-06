export function createAudioWorkletModule(processor) {
    const blob = new Blob([processor], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}
