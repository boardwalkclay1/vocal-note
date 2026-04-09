export async function loadWhisper() {
  if (window.whisper) return window.whisper;

  const module = await WhisperFactory({
    wasmPath: "/assets/ai/whisper/whisper.wasm",
    modelPath: "/assets/ai/whisper/ggml-base.en.bin"
  });

  window.whisper = module;
  return module;
}

export async function transcribeAudio(blob) {
  const whisper = await loadWhisper();
  const buffer = await blob.arrayBuffer();

  const result = await whisper.transcribe(buffer);
  return result.text;
}
