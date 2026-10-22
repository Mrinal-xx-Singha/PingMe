let audioCtx = null

function getAudioContext() {
    if (typeof window === "undefined") return null
    if (!audioCtx) {
        const AudioContext = window.AudioContext
        if (AudioContext) {
            audioCtx = new AudioContext()
        }

    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume()
    }

    return audioCtx

}

// Crisp pop sound for sending a message
export function playSendSound() {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(450, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);

}

// Gentle two-tone chime for receiving a message
export function playReceiveSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Note 1 (E5 - 659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);
    // Note 2 (A5 - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.09);
    gain2.gain.setValueAtTime(0.18, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.25);
}